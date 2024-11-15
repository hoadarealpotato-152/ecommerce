import { httpRequest } from "../common";
import { API_ROUTES } from "../../types/const";
import { TResponse } from "../../types/type";
import { TCategoryListItem } from "../../types/category";
import { TCategoryParams } from "../../types/category";

const appendParam = (url: string, params: Partial<TCategoryParams>): string => {
  if (params) {
    url += "?";
    let check = false;
    for (const [key, value] of Object.entries(params)) {
      if (!check) {
        url += `${key}=${value}`;
        check = true;
      } else {
        url += `&${key}=${value}`;
        check = true;
      }
    }
    return url;
  }
  return url;
};

export const getCategoryList = async (
  params: Partial<TCategoryParams>
): Promise<TCategoryListItem[] | null> => {
  try {
    const url = appendParam(API_ROUTES.CATEGORY, params);
    const response = await httpRequest<TResponse<TCategoryListItem>>("GET", url);
    if (Array.isArray(response.data.content)) {
      return response.data.content;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
