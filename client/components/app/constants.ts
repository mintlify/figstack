import {
  AnnotationIcon, ClockIcon, PencilIcon, TranslateIcon, LightBulbIcon,
} from '@heroicons/react/outline';

export type FigFunction = {
  id: string;
  icon: any;
  name: string;
  description: string;
  href: string;
  iconForeground: string;
  iconBackground: string;
  primaryBackground: string;
}

export const askFunction: FigFunction = {
  id: 'ask',
  icon: LightBulbIcon,
  name: 'Ask Question',
  description: 'Get answers to questions about your code as if you are asking a programming instructor',
  href: '/app/ask',
  iconForeground: 'text-white',
  iconBackground: 'bg-fig-orange',
  primaryBackground: 'text-fig-orange',
};

export const explainFunction = {
  id: 'explain',
  icon: AnnotationIcon,
  name: 'Explain Code',
  description: 'Reading code is hard! Have Figstack explain what your code does in english',
  href: '/app/explain',
  iconForeground: 'text-white',
  iconBackground: 'bg-fig-pink',
  primaryBackground: 'text-fig-pink',
};

export const translateFunction = {
  id: 'translate',
  icon: TranslateIcon,
  name: 'Language Translator',
  description: 'Convert your code from one programming language to another',
  href: '/app/translate',
  iconForeground: 'text-white',
  iconBackground: 'bg-fig-yellow',
  primaryBackground: 'text-fig-yellow',
};

export const docstringFunction = {
  id: 'docstring',
  icon: PencilIcon,
  name: 'Docstring Writer',
  description: 'Use Figstack to write a detailed description of how your function works',
  href: '/app/docstring',
  iconForeground: 'text-white',
  iconBackground: 'bg-fig-green',
  primaryBackground: 'text-fig-green',
};

export const complexityFunction = {
  id: 'complexity',
  icon: ClockIcon,
  name: 'Time Complexity',
  description: 'Calculate the time complexity of your functions in Big O notion',
  href: '/app/complexity',
  iconForeground: 'text-white',
  iconBackground: 'bg-fig-purple',
  primaryBackground: 'text-fig-purple',
};

export const figFunctions: FigFunction[] = [
  explainFunction,
  askFunction,
  docstringFunction,
  complexityFunction,
  translateFunction,
];

export const getFigFunctionById = (id: string) => figFunctions.find(
  (figFunction) => figFunction.id === id,
);

export const programmingLanguages: string[] = ['ActionScript', 'Bash', 'C', 'C#', 'CLike', 'Clojure', 'CoffeeScript', 'CPP', 'CSS', 'CSS-extr', 'Dart', 'Ddiff', 'Git', 'Go', 'GraphQL', 'Handlebars', 'Java', 'JavaScript', 'JSX', 'LESS', 'Makefile', 'Markup', 'ObjectiveC', 'OCaml', 'PHP', 'Python', 'R', 'Reason', 'Ruby', 'Rust', 'SASS', 'Scala', 'SCSS', 'SQL', 'Stylus', 'TSX', 'TypeScript', 'Wasm', 'YAML'];

// Dropdown
const DEFAULT_DROPDOWN = 'Select Programming Language';

export const removeDefaultDropdown = (dropdownLanguage: string) => {
  if (dropdownLanguage === DEFAULT_DROPDOWN) return null;

  return dropdownLanguage;
};

export const explainLanguagesDropdown = [DEFAULT_DROPDOWN, ...programmingLanguages];

const translatableLanguages: string[] = ['C', 'CPP', 'JavaScript', 'Go', 'Java', 'Ruby', 'Python', 'Haskel', 'OCaml'];

export const translateLanguagesDropdown = [
  DEFAULT_DROPDOWN,
  ...translatableLanguages];

export const INTRO_EXAMPLES = {
  explain: {
    language: 'Python',
    code: `def twoSum(self, nums, target):
  buffer_dictionary = {}
  for i in rangenums.__len()):
    if nums[i] in buffer_dictionary:
      return [buffer_dictionary[nums[i]], i]
    else:
      buffer_dictionary[target - nums[i]] = i`,
  },
  ask: {
    language: 'OCaml',
    code: `let nacci n k =
  if k <= 0 then [0] else
  if k = 1 || k = 2 then [1] else
    List.rev (makeList k [] n)`,
    question: 'What is the variable k?',
  },
  docstring: {
    language: 'Python',
    code: `def rollem(first, last):
  first_roll = random.randint(first, last)
  second_roll = random.randint(first, last)
  return first_roll + second_roll`,
  },
  complexity: {
    language: 'Java',
    code: `public static void qSort(int[] b, int h, int k) {
  if (k+1 – h < 2) return;
  int j = partition(b, h, k);
  qSort(b, h, j-1);
  qSort(b, j+1, k);
}`,
  },
  translate: {
    language: 'JavaScript',
    code: `def push(self, new_data):
  new_node = Node(new_data)
  new_node.next = self.head
  self.head = new_node`,
  },
};
