import Button from "@mui/material/Button";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import { signIn, useSession } from "next-auth/react";
import Router from "next/router";
import WavyBackgroundSvg from "../../components/WavyBackgroundSvg";
import { UserType } from "../../prisma/enums";

const SignIn = () => {
  const [loaded, setloaded] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setloaded(false);
      Router.push("/");
    }

    if (!loaded && status === "unauthenticated") setloaded(true);
  }, [loaded, status]);

  return (
    <>
      <WavyBackgroundSvg />
      {/* Sign In Form */}
      <div className={`${styles.wrapper} ${!loaded && styles.unloadedWrapper}`}>
        <Image
          src={"/assets/svg/logo.svg"}
          alt={"chaalk logo"}
          layout={"fixed"}
          width={`${103 * 2}px`}
          height={`${28 * 2}px`}
        />
        <h1>Login With:</h1>
        <Button
          onClick={() => signIn("google")}
          className={`${styles.button}`}
          variant="contained"
          startIcon={<GoogleIcon />}
        >
          Google
        </Button>
        <Button
          className={`${styles.button}`}
          variant="contained"
          startIcon={<EmailIcon />}
        >
          Email
        </Button>
      </div>
    </>
  );
};

export default SignIn;
