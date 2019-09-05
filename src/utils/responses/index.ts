export enum TYPES {
    EMPTY,
    TEXT,
    BOOLEAN,
    OBJECT,
    ARRAY,
}

export interface ApiResponse {
    success: boolean;
    data: object|null;
}


const index = (data: any, status?: number): ApiResponse => {
  let type: TYPES = TYPES.EMPTY;

  if (data === true || !data) {
    type = TYPES.BOOLEAN;
  } else if (typeof data === 'string' || typeof data === 'number') {
    type = TYPES.TEXT;
  } else if (Array.isArray(data)) {
    type = TYPES.ARRAY;
  } else if (typeof data === 'object') {
    type = TYPES.OBJECT;
  }

  const response: ApiResponse = {
    success: status ? status < 300 : false,
    data: null,
  };

  switch (type) {
    case TYPES.EMPTY:
      break;
    case TYPES.BOOLEAN:
      response.success = !!data;
      break;
    case TYPES.TEXT:
      response.data = data;
      break;
    case TYPES.OBJECT:
      response.data = data;
      response.success = !data.errors;
      break;
    case TYPES.ARRAY:
      response.data = data;
      response.success = true;
      break;
    default:
      break;
  }

  // Compile the response to JSON and parse it back to object
  // So the koa handler can set the correct content type
  console.log('bef');
  const stringified = JSON.stringify(response);
  console.log('string', stringified);
  return JSON.parse(stringified);
};

export default index;

