import { useEffect } from "react";
import { User } from "firebase/auth";
import { getOOTD } from "../../services/ootdService";
import useOOTDStore from "../../services/stores/ootdStore";
import useUserStore from "../../services/stores/userStore";

//Check if the OOTD is already posted or not
const useCheckDailyPost = () => {
  //ootdStore initialization
  const resetOotdStore = useOOTDStore((state) => state.resetOotdStore);
  const setOotd = useOOTDStore((state) => state.setOotd);

  //initialize userStore
  const user = useUserStore((state) => state.user);

  //check if user has posted daily ootd. If so, populate ootdStore with that ootd object
  useEffect(() => {
    if (!user.uid) return;

    const loadOotd = async () => {
      const now = new Date();
      const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const todayId = `${user.uid}_${date}`;
      const populateOotd = await getOOTD(todayId);

      //update ootdStore if today's ootd exists
      if(populateOotd){
        console.log("ootd found!");
        setOotd("imageUrl", populateOotd.imageUrl);
        setOotd("caption", populateOotd.caption);
      }
      else{
        console.log("ootd not found!");
        resetOotdStore();
      }
    }

    loadOotd();
  }, [user.uid]);
}

export default useCheckDailyPost;