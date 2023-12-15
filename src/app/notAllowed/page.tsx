import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardNotAllowedTitle, CardNotAllowedDescription } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import Link from "next/link"

export default function NotAllowed() {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <Card className='w-[350px]'>
                <CardHeader>
                    <CardNotAllowedTitle>404</CardNotAllowedTitle>
                    <CardNotAllowedDescription>Usuário não autorizado, entre com sua conta.</CardNotAllowedDescription>
                </CardHeader>
                <CardContent>
                    <Separator />
                </CardContent>
                <CardFooter className="grid mt-0">
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}