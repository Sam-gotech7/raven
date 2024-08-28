
export interface RavenBot{
	name: string
	creation: string
	modified: string
	owner: string
	modified_by: string
	docstatus: 0 | 1 | 2
	parent?: string
	parentfield?: string
	parenttype?: string
	idx?: number
	/**	Bot Name : Data	*/
	bot_name: string
	/**	Image : Attach Image	*/
	image?: string
	/**	Raven User : Link - Raven User	*/
	raven_user?: string
	/**	Description : Small Text	*/
	description?: string
	/**	Is Standard : Check	*/
	is_standard?: 0 | 1
	/**	Module : Link - Module Def	*/
	module?: string
	/**	Is AI Bot? : Check	*/
	is_ai_bot?: 0 | 1
	/**	OpenAI Assistant ID : Data	*/
	openai_assistant_id?: string
	/**	Allow Bot to Write Documents : Check	*/
	allow_bot_to_write_documents?: 0 | 1
}