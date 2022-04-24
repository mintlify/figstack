export const GET_PARAMS = (code: string): string => `def push(self, new_data):
new_node = Node(new_data)
new_node.next = self.head
self.head = new_node
###
The parameter names for the function are
1. self
2. new_data
###
function name() {
 console.log("Hi")
}
###
The parameter names for the function are
1. None
###
${code}
###
The parameter names for the function are
1. `;

export const EXPLAIN_PARAM = (code: string, parameter: string): string => `${code}
###
Here's what the above parameters are:
${parameter}: `

export const SUMMARIZE_CODE = (code: string): string => `${code}
###
Here's a one sentence summary of the above code:
`

export const GET_RETURN = (code: string): string => `${code}
###
Question: What is being returned?
Answer: `
