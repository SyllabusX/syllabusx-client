'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { branchList, semesterList, server } from '@/config';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC } from 'react';

export const dynamic = 'force-dynamic';

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
    const params = useParams();
    const router = useRouter();

    const queryClient = useQueryClient();

    const { semester, branch } = params;

    const { data, isLoading, error } = useQuery({
        queryKey: ['subjects', `${semester}`, `${branch}`],
        queryFn: async () => {
            const response = (await axios.get(
                `${server}${
                    semesterList.find((s) => semester === s.label)?.value
                }/${branchList.find((b) => branch === b.label)?.value}`
            )) as AxiosResponse;
            return response.data;
        },
    });

    const clearCache = () => {
        queryClient.clear();
        router.push('/');
    };

    if (error instanceof AxiosError)
        return (
            <div className="p-4 bg-neutral-900 rounded-lg grid place-content-center text-center">
                <h1 className="text-3xl">404 Not Found</h1>
                <p>{error.message}</p>
            </div>
        );

    return (
        <div className="grid text-neutral-50 px-5 pb-5 gap-4 w-full mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <h1 className="text-3xl text-center sm:col-span-2 md:col-span-3 lg:col-span-4">
                Subjects
            </h1>
            <div className="flex gap-2 sm:col-span-2 md:col-span-3 lg:col-span-4 justify-center">
            <h2 className="text-sm flex items-center gap-2" style={{ marginBottom: '-40px' }}>
            <Badge
            variant="secondary"
            className="flex items-center gap-2 text-md text-neutral-400"
            >
            {semesterList.find((s) => semester === s.label)?.label}
            <ChevronRight className="h-4 w-4" />
            {branchList.find((b) => branch === b.label)?.label}
            </Badge>{' '}
            </h2>

            </div>
            {isLoading && (
                <Loader2 className="h-24 w-24 animate-spin mt-5 mx-auto sm:col-span-2 md:col-span-3 lg:col-span-4" />
            )}
            {data && !(data.length > 0) && (
                <Button onClick={clearCache}>Clear Cache</Button>
            )}
            {data &&
                data.map((d: string) => (
                    <Button
                        onClick={() =>
                            router.push(
                                `/${semester}/${branch}/${_.kebabCase(d)}`
                            )
                        }
                        size="lg"
                        key={d}
                        className="xl:text-lg xl:h-16"
                    >
                        {d}
                    </Button>
                ))}
        </div>
    );
};

export default Page;
