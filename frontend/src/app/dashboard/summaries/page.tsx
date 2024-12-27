import Link from "next/link";
import { getSummaries } from "@/data/loader";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Search } from "@/components/custom/search";
import { PaginationComponent } from "@/components/custom/pagination-component";

interface LinkCardProps {
    documentId: string;
    title: string;
    summary: string;
}

function LinkCard({ documentId, title, summary }: Readonly<LinkCardProps>) {
    return (
        <Link href={`/dashboard/summaries/${documentId}`} >
            <Card className="relative h-full">
                <CardHeader>
                    <CardTitle className="leading-8 text-pink-500">
                        {title || "Video Summary"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ReactMarkdown
                        className="card-markdown prose prose-sm max-w-none
                                prose-headings:text-gray-900 prose-headings:font-semibold
                                prose-p:text-gray-600 prose-p:leading-relaxed
                                prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-gray-900 prose-strong:font-semibold
                                prose-ul:list-disc prose-ul:pl-4
                                prose-ol:list-decimal prose-ol:pl-4"
                    >
                        {summary.slice(0, 164) + "\n\n [read more]"}
                    </ReactMarkdown>
                </CardContent>
            </Card>
        </Link>
    )
}

interface SearchParamsProps {
    searchParams?: {
        page?: string;
        query?: string;
    }
}


export default async function summariesRoute({
    searchParams,
}: SearchParamsProps) {
    const search = await searchParams;
    const query = search?.query ?? "";
    const currentPage = Number(search?.page) || 1;
    const {data, meta} = await getSummaries(query, currentPage);
    const pageCount = meta?.pagination?.pageCount;
    if(!data) return null;
    return (
        <div className="grid grid-cols-1 gap-4 p-4 bg-gray-100">
            <Search />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cos-3 lg:grid-cols-4 gap-4">
                {data.map((item: LinkCardProps) => (
                    <LinkCard key={item.documentId} {...item} />
                ))}
            </div>
            <PaginationComponent pageCount={pageCount} />
        </div>
    )
}