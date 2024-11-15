import { TSearchParams } from "../../types/search";
import { httpRequest } from "../common";
import { API_ROUTES } from "../../types/const";
import { TResponse } from "../../types/type";
import {
  TBook,
  TBookDetail,
  TBookListReturn,
  TCreateProductBody,
} from "../../types/book";

const appendParam = (url: string, params: Partial<TSearchParams>): string => {
  if (params) {
    url += "?";
    let check = false;
    for (const [key, value] of Object.entries(params)) {
      if (!check) {
        url += `${key}=${value}`;
      } else {
        url += `&${key}=${value}`;
        check = true;
      }
    }
    return url;
  }
  return url;
};

export const getProductsList = async (
  params: Partial<TSearchParams>
): Promise<TBookListReturn | null> => {
  try {
    const url = appendParam(API_ROUTES.BOOK_LIST, params);
    const response = await httpRequest<TResponse<TBook>>("GET", url);
    if (Array.isArray(response.data.content)) {
      const returnData: TBookListReturn = {
        books: response.data.content,
        totalItems: response.data.metaData.totalElements,
      };
      return returnData;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getProductDetail = async (
  productId: string | undefined
): Promise<TBookDetail | null> => {
  try {
    const url = API_ROUTES.BOOK_DETAIL + `/${productId}`;
    const response = await httpRequest<TResponse<TBookDetail>>("GET", url);
    if (!Array.isArray(response.data.content)) {
      return null;
    }
    return response.data.content[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const createProduct = async (
  data: TCreateProductBody
): Promise<string | null> => {
  try {
    const url = API_ROUTES.CREATE_BOOK;
    const response = await httpRequest<TResponse<null>>("POST", url, data);
    return response.msg;
  } catch (err) {
    console.log(err);
    return null;
  }
};
