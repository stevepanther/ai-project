import Link from "next/link";
import { getUserMeLoader } from "@/app/data/services/get-user-me-loader";
import { StrapiImage } from "./strapi-image";

interface Image {
    id: number;
    documentId: string;
    url: string;
    alternativeText: string | null;
}

interface Link {
    id: number;
    url: string;
    text: string;
}

interface HeroSectionProps {
    id: number;
    documentId: string;
    __component: string;
    heading: string;
    subHeading: string;
    image: Image;
    link: Link;
}



export async function HeroSection({ data } : { readonly data: HeroSectionProps }) {
    const user = await getUserMeLoader();
    const userLoggedIn = user?.ok;

    const {heading, subHeading, image, link} = data;
    const linkUrl = userLoggedIn ? "/dashboard" : link.url;
    return (
        <header className="relative h-[1024px] overflow-hidden">
            <StrapiImage
                alt={image.alternativeText ?? "no alternative text"}
                className="absolute fixed inset-0 object-cover w-full h-full"
                height={1024}
                src={image.url}
                width={1024}
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black bg-opacity-20">
                <h1 className="text-4xl font-bold md: text-5xl lg:text-bxl">
                    {heading}
                </h1>
                <p className="mt-4 text-xl md:text-2xl">
                    {subHeading}
                </p>
                <Link
                    className="mt-8 bg-[#8B5CF6] text-white text-lg px-8 py-4 rounded-full hover:bg-[#7C3AED] transform hover:scale-105 transition duration-300"
                    href={linkUrl}
                >
                    {userLoggedIn ? "Dashboard" : link.text}
                </Link>
            </div>
        </header>
    )
}