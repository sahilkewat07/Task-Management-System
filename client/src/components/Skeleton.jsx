const Skeleton = ({ className }) => (
    <div className={`bg-gray-200 dark:bg-slate-800 animate-pulse rounded-2xl ${className}`} />
)

export const StatSkeleton = () => (
    <div className="card bg-white dark:bg-slate-900 border-none p-8 flex flex-col gap-4">
        <div className="flex justify-between items-start">
            <div className="space-y-3 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="w-14 h-14" />
        </div>
        <Skeleton className="h-1 w-full mt-4" />
    </div>
)

export const TableRowSkeleton = () => (
    <tr className="border-b border-gray-50 dark:border-slate-800">
        <td className="pl-10 pr-6 py-6 font-medium space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-32" />
        </td>
        <td className="px-6 py-6"><Skeleton className="h-6 w-20" /></td>
        <td className="px-6 py-6">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10" />
                <Skeleton className="h-4 w-24" />
            </div>
        </td>
        <td className="px-6 py-6"><Skeleton className="h-4 w-28" /></td>
        <td className="px-6 py-6"><Skeleton className="h-6 w-24" /></td>
        <td className="pr-10 pl-6 py-6"><Skeleton className="h-10 w-10 ml-auto" /></td>
    </tr>
)

export const CardSkeleton = () => (
    <div className="card bg-white dark:bg-slate-900 border-none p-10 flex flex-col gap-8">
        <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-slate-800">
            <div className="flex justify-between"><Skeleton className="h-3 w-20" /><Skeleton className="h-3 w-24" /></div>
            <div className="flex gap-4"><Skeleton className="h-12 flex-1" /><Skeleton className="h-12 w-24" /></div>
        </div>
    </div>
)

export default Skeleton
