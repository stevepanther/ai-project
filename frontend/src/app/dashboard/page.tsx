import MainComponent from "@/components/forms/video-upload-form"

export default async function DashboardRoute() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <MainComponent />
        </div>
    )
}