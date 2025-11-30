import axios from "axios";
import UserService from "../store/userService";
import ProjectService from "../store/projectService";

export const fetcher = ({
    url, // 接口地址
    method, // 请求方法 get、post、put、delete
    data, // 请求数据
    responseType,
    config, // 其他配置
    headers, // 请求头
  }: any) => {
    
    config = config || {};
    config.withCredentials = true;
    responseType && (config.responseType = responseType);

    if (config.cancelExecutor) {
      config.cancelToken = new (axios as any).CancelToken(
        config.cancelExecutor
      );
    }

    config.headers = headers || {};
    config.headers['Content-Type'] = 'application/json';
    // accessToken
    config.headers["X-Access-Token"] = UserService.getAccessToken();

    // 每次请求实时从SessionStorage读取projectId
    const currentProjectId = ProjectService.getCurrentProjectId();
    if (currentProjectId) {
      config.headers["X-Project-Id"] = currentProjectId;
    }

    let requestPromise: Promise<any>;

    if (method !== "post" && method !== "put" && method !== "patch") {
      if (data) {
          config.params = data;
      }
      requestPromise = (axios as any)[method](url, config);
  } 
  // POST/PUT/PATCH请求处理
  else {
      // 处理FormData类型
      if (data && data instanceof FormData) {
          config.headers["Content-Type"] = "multipart/form-data";
      } 
      // 处理JSON类型
      else if (
          data &&
          typeof data !== "string" &&
          !(data instanceof Blob) &&
          !(data instanceof ArrayBuffer)
      ) {
          data = JSON.stringify(data);
      }
      requestPromise = (axios as any)[method](url, data, config);
  }

      // 添加统一异常处理
  return requestPromise.catch((error: any) => {
    if (error.response) {
      const status = error.response.status;
      if(status===401){
        window.location.href = '/login';
      }
      throw error;
    }
  });

  }