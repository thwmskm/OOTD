import { useEffect } from "react";
import { User } from "firebase/auth";
import { getOOTD } from "../../services/ootdService";
import useOOTDStore from "../../services/stores/ootdStore";

const useCheckDailyPost = (user: User | null) => {

    //ootdStore initialization
      const resetOotdStore = useOOTDStore((state) => state.resetOotdStore);
      const setOotd = useOOTDStore((state) => state.setOotd);

    //check if user has posted daily ootd. If so, populate ootdStore with that ootd object
  useEffect(() => {
    if (!user) return;

    const loadOotd = async () => {
      const todayId = `${user.uid}_${new Date().toISOString().split('T')[0]}`;
      const populateOotd = await getOOTD(todayId);
      if(populateOotd){
        setOotd("imageUrl", populateOotd.imageUrl);
        setOotd("caption", populateOotd.caption);
      }
      else{
        resetOotdStore();
      }
    }

    loadOotd();
  }, [user]);
}

export default useCheckDailyPost;