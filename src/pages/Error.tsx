import {useRouteError} from "react-router-dom";

export default function Error(){
    const error =useRouteError() as {statusMessage?: string, statusText ?: string};
    return (
      <div>
          <h1>Lỗi</h1>
          <p>
              <i>{error.statusMessage || error.statusText}</i>
          </p>
      </div>
    );
}