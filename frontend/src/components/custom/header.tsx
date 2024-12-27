import Link from "next/link";
import { getUserMeLoader } from "@/app/data/services/get-user-me-loader";
import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";
import { SummaryForm } from "../forms/summary-form";

interface HeaderProps {
  data: {
    logoText: {
      id: number;
      text: string;
      url: string;
    }
    ctaButton: {
      id: number;
      text: string;
      url: string;
    };
  }
}

interface AuthUserProps {
  username: string;
  email: string;
}

export function LoggedinUser({
  userData,
}: {
  readonly userData: AuthUserProps;
}) {
  return (
    <div className="flex gap-2">
      <Link
        href={"/dashboard/account"}
        className = "font-semibold text-gray-600 hover:text-primary"
      >
        {userData.username}
      </Link>
      <LogoutButton />
    </div>
  )
}

export async function Header({ data }: Readonly<HeaderProps>) {
  
  const {ctaButton, logoText} = data[0];
  const user = await getUserMeLoader();
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800">
      <Logo text={logoText.text}/>
      <div className="flex items-center gap-4">
        {
          user.ok ? (
            <LoggedinUser userData={user.data} />
          ) : (
            <Link href={ctaButton.url}>
              <Button className="bg-[#8B5CF6] text-white px-6 py-2 rounded-full hover:bg-[#7C3AED]">{ctaButton.text}</Button>
            </Link>
          )
        }
        
      </div>
    </div>
  );
}