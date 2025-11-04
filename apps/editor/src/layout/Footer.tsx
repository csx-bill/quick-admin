import { themeable } from "amis-core";

// Footer 组件
const Footer = (props: { classnames: any }) => {
  const { classnames: cx } = props;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 text-center">
        Copyright © 2025
      </div>
    </>
  );
};

export default themeable(Footer);
