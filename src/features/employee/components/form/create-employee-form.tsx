
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserPlus2 } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { EmployeeStatus, EmployeeType, Gender, PayrollFrequency } from "../../constant/constant-data";
import { generateCustomUUID } from "@/lib/utils";
import { CreateEmployeeSchema } from "../../zod/schema";
import { ActivityLogs, Department, Designation, EmployeeEmploymentInformation, EmployeeIdentificationFinancialInformation, EmployeePersonalInformation, EmployeeSalaryInformation } from "../../types/types";
import { getAllDepartment } from "../../api/department";
import { getAllDesignation } from "../../api/designation"
import { AddEmployee, CreateEmployeeIdentificationFinancialInformation, CreateEmployeePersonalInformation, CreateEmploymentInformation, CreateSalaryInformation } from "../../api/employee";
import { toast } from "sonner";
import { createActivityLog } from "../../api/activity-logs";
import { useNavigate } from "react-router-dom";

export function CreateEmployeeForm(){
    const [uuid, setUUID] = useState<string>()
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const [isFetching, setIsFetching] = useState<boolean>(false)
	const [designations, setDesignations] = useState<Designation[]>()
	const [departments, setDepartments] = useState<Department[]>()
	const navigate = useNavigate()
	const form = useForm<z.infer<typeof CreateEmployeeSchema>>({
		resolver: zodResolver(CreateEmployeeSchema),
		defaultValues: {
			employee_id : uuid,
			firstname: '',
			middlename: '',
			lastname: '',
			
			// Personal Information
			birthday: '',
			gender: '',
			
			phone: '',
			email: '',
			
			// Contact Information
			addressLine: '',
			postalCode : '',
			
			// Employment
			department_id : '',
			designation_id : '',
			employee_type: '',
			employee_status: '',
			
			// Salary
			payroll_frequency: '',
			base_salary: '',
			
			pagibig_id : '',
			sssid: '',
			philhealth_id: '', 
			tin_id: ''
		}
	})
	
	const fetchData = useCallback(async () => {
		try {
			setIsFetching(true);

			// Fetch designations and departments concurrently
			const [designationResponse, departmentResponse] = await Promise.all([
				getAllDesignation(),
				getAllDepartment()
			]);

			// Update state with the fetched data
			if (designationResponse) {
				setDesignations(designationResponse);
			}

			if (departmentResponse) {
				setDepartments(departmentResponse);
			}
		} catch (error) {
			toast("Something went wrong",{
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">{JSON.stringify(error, null, 2)}</code>
					</pre>
				),
			});
		} finally {
			setIsFetching(false);
		}
	}, []);

	const fetchEmployeeID = useCallback(() => {
		const data = generateCustomUUID();
		setUUID(data);
	}, []);

	useEffect(() => {
		// Fetch data and generate UUID concurrently
		const loadData = async () => {
			await Promise.all([
				fetchData(),
				fetchEmployeeID()
			]);
		};

		loadData();
	}, [fetchData, fetchEmployeeID]);

	useEffect(() => {
		if (uuid) {
			form.setValue('employee_id', uuid); // Assuming `form` is defined and has `setValue` method
		}
	}, [uuid, form]);


	if (isFetching) {
		return <div>Loading...</div>; // Or a custom loading spinner/component
	}
	
	// Handle submit
	const handleSubmit = async (data: z.infer<typeof CreateEmployeeSchema>) => {
		setIsSubmitting(true)
		try{

			const employee = {
				uuid: data.employee_id,
				firstname: data.firstname,
				middlename: data.middlename,
				lastname: data.lastname,
				status: 'active'
			}
			console.log(data)
			const {employee_id} : any = await AddEmployee(employee)
			console.log(employee_id)
			toast("Success",{
				description: `Employee ${employee_id} Created. Now Creating employee information` ,
			})
			const personal_info : EmployeePersonalInformation= {
				employee_id: Number(employee_id),
				birthday: data.birthday,
				gender: data.gender,
				phone: data.phone,
				email: data.email,
				address_line: data.addressLine,
				postal_code: data.postalCode,
				emergency_contact_name: 'N/A',
				emergency_contact_phone: 'N/A',
				emergency_contact_relationship: 'N/A'
			}
			const employment_info : EmployeeEmploymentInformation = {
				employee_id: Number(employee_id),
				department_id: Number(data.department_id),
				designation_id: Number(data.designation_id),
				employee_type: data.employee_type,
				employee_status: data.employee_status
			}
			const salary_info : EmployeeSalaryInformation = {
				employee_id: Number(employee_id),
				payroll_frequency: data.payroll_frequency,
				base_salary: Number(data.base_salary)
			}
			const identification_financial_info : EmployeeIdentificationFinancialInformation = {
				employee_id: Number(employee_id),
				pag_ibig_id: data.pagibig_id,
				sss_id: data.sssid,
				philhealth_id: data.philhealth_id,
				tin: data.tin_id,
				bank_account_number: '123123'
			}
			await Promise.all([
				await CreateEmployeePersonalInformation(personal_info),
				await CreateEmploymentInformation(employment_info),
				await CreateSalaryInformation(salary_info),
				await CreateEmployeeIdentificationFinancialInformation(identification_financial_info),
			])
			
			toast("Success",{
				description: 'Employee Data has been successfully created',
			})


			const activity_log: ActivityLogs = {
				'employee_id': 1,
				'action': `Create Employee ID: ${employee_id}`
			}
			await createActivityLog(activity_log)
			navigate('/employee/users')
		} catch (error){
			toast("Error",{
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(error, null, 2)}</code>
                    </pre>
                    ),
            })
		} finally {
			setIsSubmitting(false)
		}
	}
	
    return(
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="h-full p-5 flex flex-col"
			>
				
				{/* Company Profile */}
				<div className="w-full">

					{/* Cathegory Title */}
					<div className="border-b border-white">
						<h1 className="font-semibold text-md">Company Profile</h1>
						<span className="text-sm text-slate-300">
							This is where company necessary information
						</span>
					</div>
					{/* Inputs */}
					<div className="p-3 grid grid-cols-3 gap-x-10">
						<FormField
							control={form.control}
							name = 'employee_id'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Employee ID</FormLabel>
									<FormControl>
										<Input
											disabled={true}
											placeholder=""
											className="text-black"
											
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name = 'designation_id'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Designation</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
										<FormControl>
											<SelectTrigger className="text-black">
												<SelectValue placeholder="Choose Designation"/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{designations?.map((d,i) => (
												<SelectItem key={i} value={String(d.designation_id)}>{d.title}</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name = 'department_id'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Department</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
										<FormControl>
											<SelectTrigger className="text-black">
												<SelectValue placeholder="Choose Department"/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{departments?.map((d,i) => (
												<SelectItem key={i} value={String(d.department_id)}>{d.name}</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage/>
								</FormItem>
							)}
						/>
						
						<FormField
							control={form.control}
							name = 'employee_type'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Employee Type</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
										<FormControl>
											<SelectTrigger className="text-black">
												<SelectValue placeholder="Choose Employee Type"/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{EmployeeType.map((d,i) => (
												<SelectItem key={i} value={d.value}>{d.name}</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage/>
								</FormItem>
							)}
						/>
						
						<FormField
							control={form.control}
							name = 'employee_status'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Employee Status</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
										<FormControl>
											<SelectTrigger className="text-black">
												<SelectValue placeholder="Choose Employee Status"/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{EmployeeStatus.map((d,i) => (
												<SelectItem key={i} value={d.value}>{d.name}</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage/>
								</FormItem>
							)}
						/>
					</div>
				</div>
				{/* Personal Infomation */}
				<div className="w-full">

					{/* Cathegory Title */}
					<div className="border-b border-white">
						<h1 className="font-semibold text-md">Personal Information</h1>
						<span className="text-sm text-slate-300">
							Employee's necessary informations
						</span>
					</div>
					{/* Inputs */}
					<div className="p-3 grid grid-cols-3 gap-x-10">
						<FormField
							control={form.control}
							name = 'firstname'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Firstname</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="John"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name = 'middlename'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Middlename</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="Decar"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						
						<FormField
							control={form.control}
							name = 'lastname'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Lastname</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="Doe"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						
						<FormField
							control={form.control}
							name = 'gender'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Gender</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
										<FormControl>
											<SelectTrigger className="text-black">
												<SelectValue placeholder="Gender"/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Gender.map((d,i) => (
												<SelectItem key={i} value={d.value}>{d.name}</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage/>
								</FormItem>
							)}
						/>
						
						<FormField
							control={form.control}
							name = 'birthday'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Birthday</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="12-25-2000"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name = 'phone'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="0923 232 2321"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name = 'email'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="johndoe@gmail.com"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name = 'addressLine'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Address Line</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="Prk Banana"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name = 'postalCode'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Postal Code</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="8231"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						
					</div>
				</div>
				{/* Salary Information */}
				<div className="w-full">

					{/* Cathegory Title */}
					<div className="border-b border-white">
						<h1 className="font-semibold text-md">Salary Information</h1>
						<span className="text-sm text-slate-300">
							Employee base employee and payroll configurations, all other configurations will be set to default such as, leave limit, benifits and deductions
						</span>
					</div>
					{/* Inputs */}
					<div className="p-3 grid grid-cols-3  gap-x-10">
						<FormField
							control={form.control}
							name = 'payroll_frequency'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Payroll Frequency</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
										<FormControl>
											<SelectTrigger className="text-black">
												<SelectValue placeholder="Choose Employee Status"/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{PayrollFrequency.map((d,i) => (
												<SelectItem key={i} value={d.value}>{d.name}</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage/>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name = 'base_salary'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Base Salary</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g 9999999"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						
					</div>
				</div>
				{/* Identification Finanncial Information */}
				<div className="w-full">

					{/* Cathegory Title */}
					<div className="border-b border-white">
						<h1 className="font-semibold text-md">Identification Financial Information</h1>
						<span className="text-sm text-slate-300">
							Users Tax id and other financial contribution ids
						</span>
					</div>
					{/* Inputs */}
					<div className="p-3 grid grid-cols-3  gap-x-10">
						<FormField
							control={form.control}
							name = 'pagibig_id'
							render = {({field}) => (
								<FormItem>
									<FormLabel>PAG-IBIG ID</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="2023-1-AEXP21"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name = 'sssid'
							render = {({field}) => (
								<FormItem>
									<FormLabel>SSSID</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="eg. 0012-4356789-1"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						
						<FormField
							control={form.control}
							name = 'philhealth_id'
							render = {({field}) => (
								<FormItem>
									<FormLabel>Philhealth ID</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="eg. 17-13254678-0"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name = 'tin_id'
							render = {({field}) => (
								<FormItem>
									<FormLabel>TIN ID</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="eg. 123-456-789-000"
											className="text-black"
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
					</div>
				</div>
				
				{/* Submit Button */}
				<div className="w-full flex justify-end">
				<Button
					type="submit"
					className="flex"
				>
					<span className="mr-2">
					<UserPlus2/>
					</span>
					Create Employee
				</Button>
				</div>
			</form>
		</Form>
    )
}