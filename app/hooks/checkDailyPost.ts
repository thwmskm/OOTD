import { useEffect } from "react";
import { FB_auth } from "../../database/firebase";

const checkDailyPost = () => {
    const user = FB_auth.currentUser;

    //check if user has posted daily ootd. If so, populate ootdStore with that ootd object
  useEffect(() => {
    if (!user) return;
  }, [user]);
}

export default checkDailyPost;