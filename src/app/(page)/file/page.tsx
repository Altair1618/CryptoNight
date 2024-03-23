"use client";

import React, { useRef, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Loader2, Download } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileProcessor } from '@/utils';
import { toast } from "react-toastify";
import UploadImage from "@/assets/images/upload.png";
import { CipherBinRequest, CipherBinResponse } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CipherApi from '@/api';
import { TextProcessor } from '@/utils';

const FormSchema = z.object({
    input: z.any(),

    key: z.string().refine(async (val) => val.length == 16, {
        message: "Cipher key length must be equal to 16.",
    }),

    initialVector: z.string().refine(async (val) => val.length == 16, {
        message: "Initial vector length must be equal to 16.",
    }),

    mode: z.string({
        required_error: "Please select the method you want to use.",
    }),

    encrypt: z.boolean().default(true).optional(),
});

const InputTextPage: React.FC = () => {
    const [onUpdate, setOnUpdate] = useState<boolean>(false);
    const [result, setResult] = useState<Uint8Array>();
    const [resultShow, setResultShow] = useState<string>("");
    const [messageBuffer, setMessageBuffer] = useState<Uint8Array>();
    const [fileType, setFileType] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");

    const textRefFileInput = useRef<HTMLParagraphElement>(null);
    const infoRefFileInput = useRef<HTMLParagraphElement>(null);

    const showFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
    
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    const res = new Uint8Array(e.target.result as ArrayBuffer); // Read as array buffer
                    setMessageBuffer(res);
                    setFileType(file.type);
                    setFileName(file.name);
                }
            };
            reader.readAsArrayBuffer(file);
    
            if (textRefFileInput.current) {
                textRefFileInput.current.textContent = 'File uploaded successfully!';
            }
            if (infoRefFileInput.current) {
                infoRefFileInput.current.textContent = `${file.name}`;
            }
        }
    };    

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            input: null as any,
            key: "",
            initialVector: "",
            mode: "ECB",
            encrypt: true,
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const payload: CipherBinRequest = {
                input: new Uint8Array(messageBuffer as Uint8Array),
                key: data.key,
                initialVector: data.initialVector,
                mode: data.mode,
                encrypt: data.encrypt as boolean
            };
            setOnUpdate(true);
    
            const submitResponse: CipherBinResponse = await CipherApi.cryptonightBinEncryption(payload);
            if (submitResponse.success) {
                let uintRes = new Uint8Array(Object.values(submitResponse.output));
                setResult(uintRes);
                if (uintRes.length > 2000) {
                    setResultShow("Please view the file instead");
                } else {
                    setResultShow(TextProcessor.toStringFromUint8Array(uintRes));
                }
            }
        } catch (error) {
            toast.error((error as any)?.message || 'Server is unreachable. Please try again later.');
        } finally {
            setOnUpdate(false);
        }
    }

    const handleDownload = () => {
        if (fileType !== "") {
            const blob = new Blob([result as Uint8Array], { type: fileType });
            const file = new File([blob], fileName, { type: fileType });
      
            FileProcessor.downloadFile(file, fileName);
        } else {
            if (!FileProcessor.download(TextProcessor.toStringFromUint8Array(result as Uint8Array), "Extended-vigenere-result.txt")) {
                alert("Download failed");
            }
        }
    }

    return (
        <div className="relative h-screen w-full overflow-y-auto overflow-x-hidden md:px-7 px-6 py-8">
            {/* Title section */}
            <div className="z-200 relative flex items-center">
                <Link href="/" className='flex justify-center items-center font-bold bg-white text-black p-2 px-4 mr-4 rounded-xl'>&lt;</Link>
                <h1 className="text-3xl font-bold">Cryptonight Block Cipher - File Input</h1>
            </div>
            
            {/* Encryption and Decription Section */}
            <div className="w-full flex flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 mt-5">
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center'>
                                <h1 className="text-xl font-bold">Input File</h1>
                            </div>
                            <FormField
                                control={form.control}
                                name="encrypt"
                                render={({ field }) => (
                                    <FormItem className="flex text-xl space-y-0 space-x-3 items-center p-0">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base"></FormLabel>
                                        </div>
                                        <FormControl>
                                            <>
                                                <span className='text-base font-semibold'>Decrypt  </span>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <span className='text-base font-semibold'>  Encrypt</span>
                                            </>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="input"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-xl font-bold mb-1">
                                        <div className="border-2 border-dashed border-white-3 rounded-lg p-4 py-5 w-full items-center cursor-pointer bg-primaryYellow hover:bg-secondaryYellow duration-200 flex flex-col">
                                            <div className='w-1/5 flex items-center justify-center'>
                                                <Image
                                                    src={UploadImage}
                                                    className="block w-25"
                                                    alt=""
                                                />
                                            </div>
                                            <div className='w-4/5'>
                                                <p className="text-base font-bold text-center" ref={textRefFileInput}>
                                                    Please upload your input file here...
                                                </p>
                                                <p className="text-sm font-normal text-center mt-1" ref={infoRefFileInput}>
                                                    You haven't uploaded any files, yet!
                                                </p>
                                            </div>
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="file" onChange={showFile} className="hidden"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex w-full space-x-5">
                            <FormField
                                control={form.control}
                                name="key"
                                render={({ field }) => (
                                    <FormItem className='w-2/5'>
                                        <FormLabel className="text-xl font-bold mb-1">Cipher Key</FormLabel>
                                        <FormControl>
                                            <Input placeholder="insert the key here" {...field} className="md:text-sm text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="initialVector"
                                render={({ field }) => (
                                    <FormItem className='w-2/5'>
                                        <FormLabel className="text-xl font-bold mb-1">Initial Vector</FormLabel>
                                        <FormControl>
                                            <Input placeholder="insert the key here" {...field} className="md:text-sm text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mode"
                                render={({ field }) => (
                                    <FormItem className='w-1/5'>
                                        <FormLabel className="text-xl font-bold mb-1">Mode</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a mode" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ECB">ECB</SelectItem>
                                                <SelectItem value="CBC">CBC</SelectItem>
                                                <SelectItem value="OFB">OFB</SelectItem>
                                                <SelectItem value="CFB">CFB</SelectItem>
                                                <SelectItem value="Counter">Counter</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="mt-5 md:text-sm text-base" disabled={onUpdate}>
                            {onUpdate ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing
                                </>
                            ) : (
                                'Process'
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="space-y-2 mt-10 w-full">
                    <div className="flex items-center justify-between">
                        <div className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xl font-bold mb-1">Result</div>
                        {result && <div className="flex items-center space-x-5">
                            <Button className="md:text-sm text-base flex justify-center space-x-2" onClick={handleDownload}>
                                <Download className="h-4 w-4" /> <span>Download</span>
                            </Button>
                        </div>}
                    </div>
                    {result ? (
                        TextProcessor.containsNonPrintableChars(resultShow) ? (
                            <div className="text-base">
                                The result contains characters that may not display correctly here. Please download the result for an accurate representation.
                            </div>
                        ) : (
                            <div className="mx-auto h-40 w-full overflow-y-auto break-words rounded-md border bg-background px-3 py-2 ring-offset-background md:text-sm text-base text-wrap">
                                {resultShow}
                            </div>
                        )
                    ) : (
                        <div>Please fill the encryption/decryption form above first</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InputTextPage;