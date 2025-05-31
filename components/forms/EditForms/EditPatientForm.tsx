'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updatePatient } from '@/lib/actions/patient.actions'
import { PatientEditFormValidation } from '@/lib/validation'
import { Phone, Mail, Calendar, User, MapPin } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'

type PatientFormData = z.infer<typeof PatientEditFormValidation>;

export default function EditPatientForm({
    initialData,
    onSave,
}: {
    initialData: any
    onSave: Function
}) {
    const form = useForm<PatientFormData>({
        resolver: zodResolver(PatientEditFormValidation),
        defaultValues: {
            name: initialData.name,
            email: initialData.email,
            phone: initialData.phone ? initialData.phone.toString() : "",
            gender: initialData.gender,
            address: initialData.address,
            birthdate: initialData.birthdate
                ? new Date(initialData.birthdate).toISOString().split("T")[0]
                : "",
        },
    })

    const onSubmit = async (data: PatientFormData) => {
        try {
            const result = await updatePatient(initialData._id, data);
            if (result.success) {
                onSave(result.updatedPatient);
                // Optionally add toast.success here if you want feedback
            } else {
                console.error(result.message);
                // Optionally add toast.error here
            }
        } catch (error) {
            console.error(error);
            // Optionally add toast.error here
        }
    }

    return (
        <div className="w-full bg-black/50 flex items-center justify-center z-50">
            <div className="p-6 bg-blue-50 w-full max-w-3xl  shadow-md">
                <h2 className="text-2xl font-bold mb-1">Edit patient</h2>
                <p className="text-sm text-gray-500 mb-6">Fill in the details</p>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <Label htmlFor="name" className="flex items-center gap-2 mb-1 font-medium">
                                <User size={16} /> Full name
                            </Label>
                            <Input
                                id="name"
                                {...form.register("name")}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring"
                            />
                            {form.formState.errors.name && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="flex items-center gap-2 mb-1 font-medium">
                                <Mail size={16} /> Email
                            </Label>
                            <Input
                                id="email"
                                {...form.register("email")}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring"
                            />
                            {form.formState.errors.email && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <Label htmlFor="phone" className="flex items-center gap-2 mb-1 font-medium">
                                <Phone size={16} /> Phone number
                            </Label>
                            <Input
                                id="phone"
                                {...form.register("phone")}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring"
                            />
                            {form.formState.errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <Label htmlFor="birthdate" className="flex items-center gap-2 mb-1 font-medium">
                                <Calendar size={16} /> Date of Birth
                            </Label>
                            <Input
                                id="birthdate"
                                type="date"
                                {...form.register("birthdate")}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring"
                            />
                            {form.formState.errors.birthdate && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.birthdate.message}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <Label htmlFor="gender" className="block font-medium mb-1">
                                Gender
                            </Label>
                            <select
                                id="gender"
                                {...form.register("gender")}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring"
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {form.formState.errors.gender && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.gender.message}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <Label htmlFor="address" className="flex items-center gap-2 mb-1 font-medium">
                                <MapPin size={16} /> Address
                            </Label>
                            <Input
                                id="address"
                                {...form.register("address")}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring"
                            />
                            {form.formState.errors.address && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-md"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    )
}
