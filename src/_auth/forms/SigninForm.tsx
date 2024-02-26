import { Button } from '@/components/ui/button'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { useToast } from "@/components/ui/use-toast"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SigninValidation } from '@/lib/validation'
import { Loader } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

const SigninForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const { mutateAsync: signInAccount} = useSignInAccount();
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })
    console.log(session)

    if (!session) {
      return toast({title: 'Sign in failed. Please try again.'})
    }

    const isLoggedIn = await checkAuthUser();
  
    if (isLoggedIn) {
      form.reset();
      navigate('/')
    } else {
      return toast({title: 'Sign in failed. Please try again.'})
    }
  }
  return (
    <div>
        <Form {...form}>
          <div className='sm:w-420 flex-center flex-col'>
            <img src="/assets/images/logo.svg"/>
            <h2 className='h3-bold md:h2-bold pt-5 sm:pt-7'>Login to your account</h2>
            <p className='text-light-3 small-medium md:base-regular mt-2'>Welcome back! please enter your details</p>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        className='shad-input'
                        placeholder="Type your email" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className='text-red' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        className='shad-input'
                        placeholder="Type your password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className='text-red' />
                  </FormItem>
                )}
              />
              <Button 
                type="submit"
                className='shad-button_primary'
              >
                {isUserLoading ? (
                  <div className='flex-center gap-2'>
                   <Loader/> Loading...
                  </div>
                ): "Sign up"}
              </Button>

              <p className='text-small-regular text-light-2 text-center mt-2'>
                  Don't have an account?
                <Link
                  to="/sign-up"
                  className='text-primary-500 text-small-semibold ml-1'
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>

        </Form>
    </div>
  )
}

export default SigninForm
