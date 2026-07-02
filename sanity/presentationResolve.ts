import {defineDocuments} from 'sanity/presentation'
import {HOME_PAGE_ID} from './ids'

export const mainDocuments = defineDocuments([
  {
    route: '/',
    filter: `_type == "homePage" && _id == $id`,
    params: {id: HOME_PAGE_ID},
  },
])
