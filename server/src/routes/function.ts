import express, { Request, Response } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import analytics from '../analytics';
import { getUserInfoFromToken, getUserInfoFromGitHubUsername, doesExceedQuota } from './user';
import { EXPLAIN_SIMPLE, EXPLAIN_WITH_LANGUAGE } from '../prompts/explain';
import { ASK } from '../prompts/ask';
import { EXPLAIN_PARAM, GET_PARAMS, SUMMARIZE_CODE, GET_RETURN } from '../prompts/docstring';
import { TRANSLATE } from '../prompts/translate';
import { COMPLEXITY } from '../prompts/complexity';
import { OPENAI_AUTHORIZATION } from '../constants/connection';
import Fig from '../models/Fig';

const CODEX_ENDPOINT = 'https://api.openai.com/v1/engines/code-davinci-002/completions';
const CODEX_CUSHMAN_ENDPOINT = 'https://api.openai.com/v1/engines/code-cushman-001/completions';
const AVERAGE_CODEX_TOKENS_BUDGET = 680;
const CODEX_TEMPERATURE = 0;

const MAX_CODE_LENGTH = 1500;

const functionRouter = express.Router();

export type FigFunction = 'explain' | 'ask' | 'docstring' | 'complexity' | 'translate';

type LogFunction = {
  id: string;
  email: string;
  figFunction: FigFunction;
  input: string;
  output: string;
  source?: string;
  inputLanguage: string;
  outputLanguage: string;
}

type RequiredArg = {
  value: string | null | undefined;
  errorOnEmpty: string;
}

type ConditionalArg = {
  condition: boolean;
  errorOnFail: string;
}

const logNewFunction = async (figLog: LogFunction) => {
  const newFigLog = new Fig(figLog);
  await newFigLog.save();
}

const throwErrorOnEmpty = (...args: RequiredArg[]) => {
  args.forEach((arg) => {
    if (arg.value == null || arg.value === '') {
      throw arg.errorOnEmpty;
    }
  })
}

const throwErrorOnCondition = (...args: ConditionalArg[]) => {
  args.forEach((arg) => {
    if (arg.condition) {
      throw arg.errorOnFail;
    }
  })
}

functionRouter.post('/v1/explain', async (req: Request, res: Response) => {
  // Should match /api/function/explain on frontend
  const { code, inputLanguage, outputLanguage,
    accessToken, refreshToken, source, githubUsername } = req.body;

  try {
    const codeTrimmed = code.trim();

    throwErrorOnEmpty(
      { value: codeTrimmed, errorOnEmpty: 'No code entered' },
      { value: inputLanguage, errorOnEmpty: 'No programming language selected' },
    );
    throwErrorOnCondition(
      { condition: code.length > MAX_CODE_LENGTH, errorOnFail: `Input cannot exceed over ${MAX_CODE_LENGTH} characters` }
    )
    let userInfo, newTokens;
    if (githubUsername) {
      userInfo = await getUserInfoFromGitHubUsername(githubUsername);
    } else {
      ({ userInfo, newTokens } = await getUserInfoFromToken(accessToken, refreshToken));
    }
    const isQuotaExceeded = await doesExceedQuota(userInfo.email);
    if (isQuotaExceeded) {
      throw 'Monthly quota exceeded. Upgrade your plan to continue'
    }
    const isLongerThanOneLine = codeTrimmed.split('\n').length > 1;
    const { prompt, stop, postFormat } = isLongerThanOneLine
      ? EXPLAIN_WITH_LANGUAGE(codeTrimmed, inputLanguage) : EXPLAIN_SIMPLE(codeTrimmed, inputLanguage);
    
    const codexResponse = await axios.post(CODEX_ENDPOINT, {
      prompt,
      temperature: CODEX_TEMPERATURE,
      max_tokens: AVERAGE_CODEX_TOKENS_BUDGET,
      stop,
    }, OPENAI_AUTHORIZATION);

    const firstResponse = codexResponse.data.choices[0].text;
    let output = postFormat(firstResponse);
    const responseIsLooped = output.split('\n').length > 15;
    // If response is bad, use backup
    if (responseIsLooped) {
      const { prompt: backupPrompt, stop: backupStop, postFormat: backupPostFormat }  = EXPLAIN_SIMPLE(codeTrimmed, inputLanguage);

      const backupCodexResponse = await axios.post(CODEX_ENDPOINT, {
        prompt: backupPrompt,
        temperature: CODEX_TEMPERATURE,
        max_tokens: AVERAGE_CODEX_TOKENS_BUDGET,
        stop: backupStop,
      }, OPENAI_AUTHORIZATION);

      const backupFirstResponse = backupCodexResponse.data.choices[0].text;
      output = backupPostFormat(backupFirstResponse);
    }
    const id = uuidv4();
    await logNewFunction({
      id,
      email: userInfo.email as string,
      figFunction: 'explain',
      input: codeTrimmed,
      inputLanguage,
      outputLanguage,
      output,
      source,
    });

    analytics.track({
      userId: userInfo.userId,
      event: 'Explain Function',
      properties: {
        source,
        inputLanguage,
        outputLanguage,
      }
    });

    return res.status(200).send({id, output, newTokens});

  } catch (error) {
    res.status(400).send({
      error,
    })
  } 
});

functionRouter.post('/v1/ask', async (req: Request, res: Response) => {
  // Should match /api/function/ask on frontend
  const { code, inputLanguage, question, accessToken, refreshToken, source, githubUsername } = req.body;

  try {
    throwErrorOnEmpty(
      { value: code, errorOnEmpty: 'No code entered' },
      { value: question, errorOnEmpty: 'No question provided' },
      { value: inputLanguage, errorOnEmpty: 'No programming language selected' },
    );
    throwErrorOnCondition(
      { condition: code.length > MAX_CODE_LENGTH, errorOnFail: `Input cannot exceed over ${MAX_CODE_LENGTH} characters` }
    )
    let userInfo, newTokens;
    if (githubUsername) {
      userInfo = await getUserInfoFromGitHubUsername(githubUsername);
    } else {
      ({ userInfo, newTokens } = await getUserInfoFromToken(accessToken, refreshToken));
    }
    const isQuotaExceeded = await doesExceedQuota(userInfo.email);
    if (isQuotaExceeded) {
      throw 'Monthly quota exceeded. Upgrade your plan to continue'
    }

    const { prompt, stop, postFormat } = ASK(code, question, inputLanguage);
 
    const codexResponse = await axios.post(CODEX_ENDPOINT, {
      prompt,
      temperature: CODEX_TEMPERATURE,
      max_tokens: AVERAGE_CODEX_TOKENS_BUDGET,
      stop,
    }, OPENAI_AUTHORIZATION);

    const firstResponse = codexResponse.data.choices[0].text;
    const id = uuidv4();
    const output = postFormat(firstResponse);
    await logNewFunction({
      id,
      email: userInfo.email as string,
      figFunction: 'ask',
      input: code,
      inputLanguage,
      outputLanguage: question,
      output,
      source,
    });

    analytics.track({
      userId: userInfo.userId,
      event: 'Ask Function',
      properties: {
        source,
        inputLanguage
      }
    });

    return res.status(200).send({id, output, newTokens});

  } catch (error) {
    res.status(400).send({
      error,
    })
  } 
});

functionRouter.post('/v1/translate', async (req: Request, res: Response) => {
  // Should match /api/function/translate on frontend
  const { code, inputLanguage, outputLanguage, accessToken, refreshToken, source, githubUsername } = req.body;

  try {
    throwErrorOnEmpty(
      { value: code, errorOnEmpty: 'No code entered' },
      { value: inputLanguage, errorOnEmpty: 'Input language has not been selected' },
      { value: outputLanguage, errorOnEmpty: 'Output language has not been selected' }
    );
    throwErrorOnCondition(
      { condition: code.length > MAX_CODE_LENGTH, errorOnFail: `Input cannot exceed over ${MAX_CODE_LENGTH} characters` }
    )
    let userInfo, newTokens;
    if (githubUsername) {
      userInfo = await getUserInfoFromGitHubUsername(githubUsername);
    } else {
      ({ userInfo, newTokens } = await getUserInfoFromToken(accessToken, refreshToken));
    }
    const isQuotaExceeded = await doesExceedQuota(userInfo.email);
    if (isQuotaExceeded) {
      throw 'Monthly quota exceeded. Upgrade your plan to continue';
    }

    const { prompt, stop, postFormat } = TRANSLATE(code, inputLanguage, outputLanguage);

    const codexResponse = await axios.post(CODEX_ENDPOINT, {
      prompt,
      temperature: CODEX_TEMPERATURE,
      max_tokens: AVERAGE_CODEX_TOKENS_BUDGET,
      stop
    }, OPENAI_AUTHORIZATION);

    const firstResponse = codexResponse.data.choices[0].text;
    const id = uuidv4();
    const output = postFormat(firstResponse);
    await logNewFunction({
      id,
      email: userInfo.email as string,
      figFunction: 'translate',
      input: code,
      output,
      inputLanguage: inputLanguage,
      outputLanguage: outputLanguage,
      source
    });

    analytics.track({
      userId: userInfo.userId,
      event: 'Translate Function',
      properties: {
        inputLanguage: inputLanguage,
        outputLanguage: outputLanguage,
        source
      }
    });

    return res.status(200).send({id, output, newTokens});

  } catch (error) {
    res.status(400).send({
      error,
    })
  }
});

functionRouter.post('/v1/docstring', async (req: Request, res: Response) => {
  return res.status(200).send({ output: 'This version of the docstring function has been depreciated' })
});

functionRouter.post('/v2/docstring', async (req: Request, res: Response) => {
  // Should match /api/function/docstring on frontend
  const { code, inputLanguage, accessToken, refreshToken, source, githubUsername } = req.body;
  try {
    throwErrorOnEmpty(
      { value: code, errorOnEmpty: 'No code entered' },
      { value: inputLanguage, errorOnEmpty: 'No programming language selected' },
    );
    throwErrorOnCondition(
      { condition: code.length > MAX_CODE_LENGTH, errorOnFail: `Input cannot exceed over ${MAX_CODE_LENGTH} characters` }
    )
    let userInfo, newTokens;
    if (githubUsername) {
      userInfo = await getUserInfoFromGitHubUsername(githubUsername);
    }
    else {
      ({ userInfo, newTokens } = await getUserInfoFromToken(accessToken, refreshToken));
    }
    const isQuotaExceeded = await doesExceedQuota(userInfo.email);
    if (isQuotaExceeded) {
      throw 'Monthly quota exceeded. Upgrade your plan to continue';
    }
    const parametersRes = await axios.post(CODEX_CUSHMAN_ENDPOINT, {
      prompt: GET_PARAMS(code),
      temperature: CODEX_TEMPERATURE,
      max_tokens: 60,
      stop: ['###', '\n\n']
    }, OPENAI_AUTHORIZATION);

    const rawParameters = parametersRes.data.choices[0].text.trim();

    let extractedParamsExplained = null;

    if (rawParameters !== '' && rawParameters !== 'None') {
      const listedResults = `1. ${rawParameters}`.trim();
      const splitResults = listedResults.split('\n');
      const paramsArr = splitResults.map((result) => {
        return result.replace(/[0-9]{1,3}./, '').trim();
      });

      const explainParamPromises = paramsArr.map((param) => {
        return axios.post(CODEX_ENDPOINT, {
          prompt: EXPLAIN_PARAM(code, param),
          temperature: CODEX_TEMPERATURE,
          max_tokens: 60,
          stop: ['###', '\n']
        }, OPENAI_AUTHORIZATION);
      });

      const explainResults = await Promise.all(explainParamPromises);

      extractedParamsExplained = explainResults.map((result, i) => {
        return {
          param: paramsArr[i],
          explained: result.data.choices[0].text.trim()
        };
      });
    }

    // Intentionally do not call
    const summaryPromise = axios.post(CODEX_ENDPOINT, {
      prompt: SUMMARIZE_CODE(code),
      temperature: CODEX_TEMPERATURE,
      max_tokens: 120,
      stop: ['###', '\n\n']
    }, OPENAI_AUTHORIZATION);

    const returnPromise = axios.post(CODEX_ENDPOINT, {
      prompt: GET_RETURN(code),
      temperature: CODEX_TEMPERATURE,
      max_tokens: 64,
      stop: ['###', '\n\n']
    }, OPENAI_AUTHORIZATION);

    const summaryAndReturnPromises = [summaryPromise, returnPromise];
    const [summaryRes, returnRes] = await Promise.all(summaryAndReturnPromises);

    const summaryDescription = summaryRes.data.choices[0].text.trim();
    const returnDescription = returnRes.data.choices[0].text.trim();

    const docstring = (
      `${summaryDescription !== '' ? summaryDescription : 'Cannot generate summary'}

Args:
${extractedParamsExplained != null ? extractedParamsExplained.map((param) => `  ${param.param}: ${param.explained}`).join('\n') : '  None'}
Returns:
  ${returnDescription}`);

    const id = uuidv4();
    const output = docstring;

    await logNewFunction({
      id,
      email: userInfo.email as string,
      figFunction: 'docstring',
      input: code,
      inputLanguage,
      outputLanguage: 'Docstring',
      output,
      source
    });

    analytics.track({
      userId: userInfo.userId,
      event: 'Docstring Function',
      properties: {
        source,
        inputLanguage,
      }
    });


    return res.status(200).send({id, output, newTokens});

  } catch (error) {
    res.status(400).send({
      error,
    })
  }
})

functionRouter.post('/v1/complexity', async (req: Request, res: Response) => {
  const { code, inputLanguage, accessToken, refreshToken, source, githubUsername } = req.body;

  try {
    throwErrorOnEmpty(
      { value: code, errorOnEmpty: 'No code entered' },
      { value: inputLanguage, errorOnEmpty: 'No programming language selected' },
    );
    throwErrorOnCondition(
      { condition: code.length > MAX_CODE_LENGTH, errorOnFail: `Input cannot exceed over ${MAX_CODE_LENGTH} characters` }
    )
    let userInfo, newTokens;
    if (githubUsername) {
      userInfo = await getUserInfoFromGitHubUsername(githubUsername);
    } else {
      ({ userInfo, newTokens } = await getUserInfoFromToken(accessToken, refreshToken));
    }
    const isQuotaExceeded = await doesExceedQuota(userInfo.email);
    if (isQuotaExceeded) {
      throw 'Monthly quota exceeded. Upgrade your plan to continue';
    }

    const { prompt, stop, postFormat } = COMPLEXITY(code, inputLanguage);
    const codexResponse = await axios.post(CODEX_ENDPOINT, {
      prompt,
      temperature: CODEX_TEMPERATURE,
      max_tokens: AVERAGE_CODEX_TOKENS_BUDGET,
      stop,
    }, OPENAI_AUTHORIZATION);

    const firstResponse = codexResponse.data.choices[0].text;
    const id = uuidv4();
    const output = postFormat(firstResponse);
    await logNewFunction({
      id,
      email: userInfo.email as string,
      figFunction: 'complexity',
      input: code,
      inputLanguage,
      outputLanguage: 'Time Complexity',
      output,
      source
    });

    analytics.track({
      userId: userInfo.userId,
      event: 'Complexity Function',
      properties: {
        source,
        inputLanguage,
      }
    });

    return res.status(200).send({id, output, newTokens});

  } catch (error) {
    res.status(400).send({
      error,
    })
  }
});

functionRouter.put('/feedback/:id', async (req, res) => {
  const { id } = req.params;
  const { accessToken, refreshToken, isPositive, githubUsername } = req.body;

  try {
    throwErrorOnEmpty(
      { value: id, errorOnEmpty: 'No function ID provided' },
      { value: isPositive, errorOnEmpty: 'No feedback result indicated' },
    );

    let userInfo, newTokens;
    if (githubUsername) {
      userInfo = await getUserInfoFromGitHubUsername(githubUsername);
    } else {
      ({ userInfo, newTokens } = await getUserInfoFromToken(accessToken, refreshToken));
    }

    const updatedResult = await Fig.findOneAndUpdate({id, email: userInfo.email}, { feedbackIsPositive: isPositive });
    return res.status(200).send({ updated: updatedResult, newTokens });

  } catch (error) { 
    res.status(400).send({
      error,
    })
  }
})

export default functionRouter;
