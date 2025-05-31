'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updatePatient } from '@/lib/actions/patient.actions'
import { PatientEditFormValidation } from '@/lib/validation'
import { Phone, Mail, Calendar, User, MapPin } from 'lucide-react'
import { Label } from "@/components/ui/label"

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
        const result = await updatePatient(initialData._id, data);
        if (result.success) {
            onSave(result.updatedPatient);
        } else {
            console.error(result.message);
        }
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-blue-100 p-6 rounded-lg space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                        <User size={16} /> Full name
                    </Label>
                    <Input id="name" {...form.register("name")} />
                    {form.formState.errors.name && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail size={16} /> Email
                    </Label>
                    <Input id="email" {...form.register("email")} />
                    {form.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone size={16} /> Phone number
                    </Label>
                    <Input id="phone" {...form.register("phone")} />
                    {form.formState.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                    )}
                </div>

                {/* Date of Birth */}
                <div>
                    <Label htmlFor="birthdate" className="flex items-center gap-2">
                        <Calendar size={16} /> Date of Birth
                    </Label>
                    <Input id="birthdate" type="date" {...form.register("birthdate")} />
                    {form.formState.errors.birthdate && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.birthdate.message}</p>
                    )}
                </div>

                {/* Gender */}
                <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select {...form.register("gender")} className="w-full mt-1 border rounded px-3 py-2">
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
                    <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin size={16} /> Address
                    </Label>
                    <Input id="address" {...form.register("address")} />
                    {form.formState.errors.address && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    )
}
