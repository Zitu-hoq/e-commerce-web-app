
import { redirect } from "next/navigation";

export default function Profile(){

    return(
      redirect("/profile/account")
    );
  }