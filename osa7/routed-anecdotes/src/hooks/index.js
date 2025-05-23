import { useState } from "react";

export const useForm = (type) => {
  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onReset = () => {
    setValue("");
  };

  return { input: { type, value, onChange }, onReset };
};
