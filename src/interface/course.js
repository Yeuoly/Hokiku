import { api_base } from './api'
import { stringify } from 'querystring'

export const api_course_list_own = () => api_base('course/list/own', 'get', '')

export const api_course_sheet_create = (name, cover_rid)=> api_base('course/sheet/create', 'post', stringify({
	name, cover_rid
}))

export const api_course_sheet_update = (sheet_id, name, cover_rid, is_public)=> api_base('course/sheet/update', 'post', stringify({
	sheet_id, name, cover_rid, is_public
}))

export const api_course_sheet_get = (sheet_id)=> api_base('course/sheet/get', 'get', stringify({
	sheet_id
}))

export const api_course_sheet_list_public = (page, page_size) => api_base('course/sheet/list/public', 'get', stringify({
	page, page_size
}))

export const api_course_sheet_list_own = (page, page_size) => api_base('course/sheet/list/own', 'get', stringify({
	page, page_size
}))

export const api_course_sheet_list_subcribe = (page, page_size) => api_base('course/sheet/list/subcribe', 'get', stringify({
	page, page_size
}))

export const api_course_sheet_list_admin = (page, page_size) => api_base('course/sheet/list/admin', 'get', stringify({
	page, page_size
}))

export const api_course_sheet_update_admin = (sheet_id, name, cover_rid, is_public) => api_base('course/sheet/update/admin', 'post', stringify({
	sheet_id, name, cover_rid, is_public
}))

export const api_course_sheet_delete_admin = (sheet_id) => api_base('course/sheet/delete/admin', 'post', stringify({
	sheet_id
}))

export const api_course_sheet_unit_create = (sheet_id, name, course_id) => api_base('course/sheet/unit/create', 'post', stringify({
	sheet_id, name, course_id
}))

export const api_course_sheet_unit_delete = (sheet_id, unit_id) => api_base('course/sheet/unit/delete', 'post', stringify({
	sheet_id, unit_id
}))

export const api_course_sheet_list_unit = (sheet_id, page, page_size) => api_base('course/sheet/list/unit', 'get', stringify({
	sheet_id, page, page_size
}))

export const api_course_subcribe_sheet = (sheet_id) => api_base('course/sheet/subcribe', 'post', stringify({
	sheet_id
}))

export const api_course_challenge_check = (unit_id) => api_base('course/challenge/check', 'get', stringify({
	unit_id
}))