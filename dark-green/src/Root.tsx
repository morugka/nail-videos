import { MyComposition } from "./Composition";
import { BoardStills } from "./Boards";
import { HandsComposition } from "./Hands";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <HandsComposition />
      <BoardStills />
    </>
  );
};
