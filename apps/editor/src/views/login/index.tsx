import { themeable } from "amis-core";
import { AmisRenderer,Footer } from "@quick-admin-core";
import schema from "./login.json";

const Login = (props: { classnames: any }) => {
  return (
    <>
      <AmisRenderer schema={schema} />
      <Footer />
    </>
  );
};

export default themeable(Login);
