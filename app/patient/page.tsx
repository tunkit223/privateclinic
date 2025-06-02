'use client'
import SubmitButton from '@/components/SubmitButton'
import { usePathname ,useRouter } from 'next/navigation';
import React, { useState , useEffect} from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { resolve } from 'path';
import { Flag } from 'node-appwrite';
import HealthCard from '@/components/HealthCard'
import Chat from '@/components/Chat';

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading , setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  } ,[pathname]);
  async function HandleClick(){
    if(isLoading) return; 
    setIsLoading(true);
    try{
      await new Promise((resolve) => setTimeout(resolve , 2000));
      await router.push(`/patient/register`);
    }catch(error){
      console.error();
    }
  }
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center px-6 py-6">
           <Image
            src = "/assets/icons/logo-full.svg"
            alt = "Logo"
            width={200}
            height={200}
            className="mb-8 h-auto w-auto self-start"
          />
      {/* Header */}
      <div className="w-full max-w-5xl text-center pb-10">
              <h1 className="text-4xl font-bold text-gray-900">Welcome to CarePulse👋</h1>
        <p className="text-gray-600 mt-2">Your trusted healthcare companion</p>
      </div>
      
      {/* Main Content */}
      <main className="w-full max-w-5xl bg-white p-8 shadow-lg rounded-lg">
        <Image src="/assets/images/healthcare.png" width={800} height={400} alt="Healthcare" className="rounded-lg mx-auto" />
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Effect */}
            <div className="flex flex-col items-center">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
            </div>
          </div>
        )}
        <h2 className="text-2xl font-semibold text-gray-900 mt-6">Common Health Conditions</h2>
        <p className="text-gray-600 mt-2">Learn about common illnesses and their symptoms.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <HealthCard 
              title="Flu" 
              description="Symptoms include fever, cough, and fatigue." 
              link="https://www.mayoclinic.org/diseases-conditions/flu/symptoms-causes/syc-20351719"
              bgColor="bg-blue-300"
              hoverColor="bg-blue-400"
              textColor="text-white"/>
          <HealthCard 
              title="Diabetes" 
              description="Common symptoms include increased thirst and fatigue." 
              link="https://www.mayoclinic.org/diseases-conditions/diabetes/symptoms-causes/syc-20371444"
              bgColor="bg-green-300"
              hoverColor="bg-green-400"
              textColor="text-white"/>
          <HealthCard 
              title="Hypertension" 
              description="High blood pressure can lead to severe health issues." 
              link="https://www.mayoclinic.org/diseases-conditions/high-blood-pressure/symptoms-causes/syc-20373410"
              bgColor="bg-yellow-300"
              hoverColor="bg-yellow-400"
              textColor="text-white"/>
          <HealthCard
              title="Pneumonia"
              description="Cough with phlegm, fever, chills, difficulty breathing, chest pain, fatigue."
              link="https://www.mayoclinic.org/diseases-conditions/pneumonia/symptoms-causes/syc-20354204"
              bgColor="bg-purple-300"
              hoverColor="bg-purple-400"
              textColor="text-white"/>
          <HealthCard
              title="Gastritis"
              description="Stomach pain, nausea, vomiting, bloating, indigestion, loss of appetite."
              link="https://www.mayoclinic.org/diseases-conditions/gastritis/symptoms-causes/syc-20355807"
              bgColor="bg-pink-300"
              hoverColor="bg-pink-400"
              textColor="text-white"/>
          <HealthCard
              title="Migraine"
              description="Severe headache (often on one side), nausea, vomiting, sensitivity to light and sound, visual disturbances (aura)."
              link="https://www.mayoclinic.org/diseases-conditions/migraine-headache/symptoms-causes/syc-20360201"
              bgColor="bg-red-300"
              hoverColor="bg-red-400"
              textColor="text-white"/>
        </div>

        <div className="text-2xl font-semibold text-gray-900 mt-6">
              <h1>About Us</h1>
              <div className='text-gray-600 text-xl mt-2'>
                <p>👉 Providing the best healthcare services, helping people understand their health and make informed decisions.</p>
                <p>👉 Our Services : Online medical consultation , Doctor appointment booking , Health check-up guidance.</p>
                <p>👉 Why Choose Us : Experienced doctors , Fast and convenient services , 24/7 support </p>
              </div>
              <h1>Contact Us</h1>
              <div className='text-gray-600 text-xl mt-2'>
                <p>📧Email: PrivateClinic3K@gmail.com</p>
                <p>📞Phone: 19001872</p>
                <p>📍Address: University of Information Technology - UIT</p>
              </div>
         </div>
        
        <div className="flex justify-center mt-8">
          <Button onClick={HandleClick} className="bg-blue-400 text-white px-6 py-3 rounded-lg w-96 h-16 text-2xl hover:bg-blue-300 hover:scale-105 transition duration-300" disabled={isLoading}>
            Book an Appointment
          </Button>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full text-center mt-12 text-gray-600">
        <p>&copy; 2025 CarePulse. All rights reserved.</p>
      </footer>
         
    </div>
  );
}