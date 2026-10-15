import { useEffect, useState } from "react";
import type { CheckUser } from "../../../../../src/shared/types";
import { useConfluence } from "../../features/confluence/hooks/useConfluence";
import { QuestionBoard } from "../../features/questions/components/QuestionBoard";
import { CurrentUserProvider } from "../../features/confluence/context/CurrentUserContext";

type QuestionBoardProp = {
  spaceKey: string;
};

const QuestionBoardPage = ({ spaceKey }: QuestionBoardProp) => {
  const { getCurrentUser } = useConfluence();

  const [currentUser, setCurrentUser] = useState<CheckUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentUser() {
      const user = await getCurrentUser.request();

      if (cancelled) return;

      if (user) {
        setCurrentUser(user);
      }

      setIsLoading(false);
    }

    void loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <p>Loading current user...</p>;
  }

  return (
    <CurrentUserProvider currentUser={currentUser}>
      <QuestionBoard spaceKey={spaceKey as string} />{" "}
    </CurrentUserProvider>
  );
};

export default QuestionBoardPage;
