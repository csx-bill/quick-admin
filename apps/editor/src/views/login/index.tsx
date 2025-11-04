import { themeable } from "amis-core";
import AmisRenderer from "@/components/AmisRenderer";
import schema from "./login.json";
import Footer from "@/layout/Footer";

const Login = (props: { classnames: any }) => {
  return (
    <>
      <AmisRenderer schema={schema} />
      <Footer />
    </>
  );
};

export default themeable(Login);
