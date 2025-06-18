import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const supabase = createServerComponentClient({ cookies })
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
    redirect("/login")
}

export default async function MyPage() {
    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl mb-4">My Page</h1>
            <p>Welcome, {session?.user?.email}</p>
            <p>Your ID: {session?.user?.id}</p>
        </div>
    )
}