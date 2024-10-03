import { createContext, FC, useContext } from 'react';

//export const LevelContext = createContext(1);
export const AuthoringCardPropsContext = createContext<{
  onPrev: () => void;
  onFinish: () => void;
}>({
  onPrev: () => {},
  onFinish: () => {},
});

export const AuthoringCardPropsProvider: FC<{
  onPrev: () => void;
  onFinish: () => void;
  children: React.ReactNode;
}> = ({ children, onPrev, onFinish }) => {
  return (
    <AuthoringCardPropsContext.Provider value={{ onPrev, onFinish }}>
      {children}
    </AuthoringCardPropsContext.Provider>
  );
};

export const useAuthoringCardProps = () => {
  const { onPrev: onPrevFromContext, onFinish: onFinishFromContext } =
    useContext(AuthoringCardPropsContext);
  return {
    onPrev: onPrevFromContext,
    onFinish: onFinishFromContext,
  };
};
