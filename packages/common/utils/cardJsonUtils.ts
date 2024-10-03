import { SlateJSON } from '../features/Cards/cardTypes'
import { CustomTags, CustomText } from '../types/RichTextTypes'

type CustomTextOptions = Omit<CustomText,'text'>
export const getSlateNode = (type:CustomTags, text:string,options: CustomTextOptions = {}):SlateJSON => {
    return [
        {
          type,
          children: [
            {
              text,
              ...options
            },
          ],
        },
      ]
}
