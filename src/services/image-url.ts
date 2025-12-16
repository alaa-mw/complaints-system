// import noImage from '../assets/default.png';

import { baseUrl } from "./api-client";

const getImageUrl = (url: string) => {
  // if(!url) return noImage;

  // console.log("path", baseUrl + url);
  return baseUrl+"/" + url;
}

export default getImageUrl;