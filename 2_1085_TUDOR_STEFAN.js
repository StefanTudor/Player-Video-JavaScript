document.addEventListener('DOMContentLoaded', app);
        function app() {
            //Model
            let video = document.createElement('video');
            const videos = ['media/video1.mp4', 'media/video2.mp4', 'media/video3.mp4', 'media/video4.mp4'];
            let position = 0;
           

            video.src = videos[position];
            video.load();
            video.controls = true;

            //document.body.append(video);


            const canvas = document.querySelector('canvas');
            const W = canvas.width, H = canvas.height;
            const context = canvas.getContext('2d');
           
            const contextMenu = document.getElementById('contextMenu');
            const caption = document.getElementById('caption');
            const vintage = document.getElementById('vintage');
            const bright = document.getElementById('bright');
            const dark = document.getElementById('dark');
            const defaultEf = document.getElementById('default');
            let effect = "default";
            contextMenu.style.display = "none";


            const bx = (W / 2) - 14, by = H - 26, bw = 20, bh = 20;
            

            //Desenare

            function desenare() {
                context.drawImage(video, 0, 0, W, H);
                const videoPixels = context.getImageData(0, 0, W, H);
                const v = videoPixels.data;


                if (effect === "vintage") {
                    for (let i = 0; i < W * H * 4; i += 4) {
                        v[i] = v[i + 1] = v[i + 2] = (v[i] + v[i + 1] + v[i + 2]) / 3;
                    }
                    context.putImageData(videoPixels, 0, 0);
                } else if (effect === "bright") {
                    for (let i = 0; i < W * H * 4; i += 4) {
                        v[i] = v[i] * 1.2; //red pixel
                        v[i + 1] = v[i + 1] * 1.2; //green pixel
                        v[i + 2] = v[i + 2] * 1.2; //blue pixel
                    }
                    context.putImageData(videoPixels, 0, 0); 

                } else if (effect === "dark") {
                    for (let i = 0; i < W * H * 4; i += 4) {
                        v[i] = v[i] * 0.4; //red pixel
                        v[i + 1] = v[i + 1] * 0.4; //green pixel
                        v[i + 2] = v[i + 2] * 0.4; //blue pixel
                    }
                    context.putImageData(videoPixels, 0, 0); 

                } else if (effect === "default") {
                    context.drawImage(video, 0, 0, W, H);
                }

                

                //desenare bottom bar
                context.fillStyle = "rgba(240, 239, 239, 0.6)";
                context.fillRect(0, H - 40, W, 40);

                let timer = 0;
                if (video.currentTime && video.duration) {
                    timer = video.currentTime / video.duration;
                }
                
                //desenare progress bar
                context.fillStyle = 'rgba(0, 0, 0, 0.1)';
                context.strokeStyle = 'rgba(240, 239, 239, 0)';
                context.fillRect(0, H - 40, W, 8);
                context.strokeRect(0, H - 40, W, 8);
                context.fillStyle = '#ba0707';
                context.fillRect(0, H - 40, timer * W, 8);
                context.strokeRect(0, H - 40, W, 8);
                
                //desenare buton next
                context.strokeStyle = '#000';
                context.lineWidth = 1.5;
                context.beginPath();
                context.arc(bx + 60, by + 10, bw - 9, bh - 9, 1.5 * Math.PI);
                context.moveTo(bx + 57, by + 5, bw, bh);
                context.lineTo(bx + 65, by + 10, bw, bh);
                context.lineTo(bx + 57, by + 15, bw, bh);
                context.closePath();
                context.stroke();

                //desenare buton prev
                context.beginPath();
                context.arc(bx - 40, by + 10, bw - 9, bh - 9, 1.5 * Math.PI);
                context.moveTo(bx - 37, by + 5, bw, bh);
                context.lineTo(bx - 45, by + 10, bw, bh);
                context.lineTo(bx - 37, by + 15, bw, bh);
                context.closePath();
                context.stroke();

                //desenare buton play/pause
                if(video.paused) {
                    context.strokeStyle = '#000';
                    context.fillStyle = '#000';
                    context.beginPath();
                    context.moveTo(bx + 3, by, bw, bh);
                    context.lineTo(bx + 18, by + 10, bw, bh);
                    context.lineTo(bx + 3, by + 20, bw, bh);
                    context.closePath();
                    context.fill();
                    context.stroke();
                } else {
                    context.fillRect(bx + 2, by, bw - 15, bh);
                    context.strokeRect(bx + 2, by, bw - 15, bh);
                    context.fillRect(bx + 10, by, bw - 15, bh);
                    context.strokeRect(bx + 10, by, bw - 15, bh);
                }

                if(video.ended) {
                next();
            }
                requestAnimationFrame(desenare);
            }
            //desenare();


            //Event handlers
            function next() {
                if(position >= videos.length - 1) {
                    position = -1;
                }
                video.src = videos[++position];
                video.load();
                video.play();
            }

            function prev() {
                if(position <= 0) {
                    position = videos.length;
                }
                video.src = videos[--position];
                video.load();
                video.play();
            }

            video.addEventListener('loadeddata', () => {
                setTimeout(desenare, 1000/30);
            });

            canvas.addEventListener('click', e => {
                const mx = e.clientX - canvas.getBoundingClientRect().left;
                const my = e.clientY - canvas.getBoundingClientRect().top;

                // click buton play/pause
                if(mx >= bx && mx <= bx + bw && my >= by && my <= by + bh) {
                    if(video.paused) {
                        video.play()
                    } else {    
                        video.pause();
                    }
                }

                // click progress bar
                if (video.duration && mx >= 0 && mx <= W && my >= H - 40 && my <= H - 32) {
                    const pozitie = mx / W;
                    video.currentTime = pozitie * video.duration;
                }

                // click buton next
                if(mx >= bx + 50 && mx <= (bx + 50) + bw && my >= by && my <= by + bh) {
                    next();
                }

                // click buton prev
                if(mx >= bx - bw - 40 && mx <= bx - 30 && my >= by && my <= by + bh) {
                    prev();
                }
                
            });

            canvas.addEventListener('contextmenu', e => {
                e.preventDefault();
                const mx = e.clientX - canvas.getBoundingClientRect().left;
                const my = e.clientY - canvas.getBoundingClientRect().top;

                // click pe canvas pentru afisare meniu contextual
                if(mx >= 0 && mx <= W && my >= 0 && my <= H) {
                    contextMenu.style.display = "block";
                    contextMenu.style.top = e.clientY + "px";
                    contextMenu.style.left = e.clientX + "px";
                }

            });

            // click pentru ascunedrea meniului contextual
            document.body.addEventListener('click', e => {
                if(contextMenu.style.display === "block") {
                    contextMenu.style.display = "none";
                }
            });

            caption.addEventListener('click', e => {
                let canvasTemp = document.createElement('canvas');
                let contextTemp = canvasTemp.getContext('2d');
                canvasTemp.width = W;
                canvasTemp.height = H - 60;
                contextTemp.drawImage(video,0 ,0, W, H - 60);
                var link = document.getElementById('download');
                link.setAttribute('download', 'screenshot.png');
                link.setAttribute('href', canvasTemp.toDataURL("image/png"));
                link.click();
            });

            vintage.addEventListener('click', e => {
                effect = "vintage";
            });

            bright.addEventListener('click', e => {
                effect = "bright";   
            });

            dark.addEventListener('click', e => {
                effect = "dark";
            });

            defaultEf.addEventListener('click', e => {
                effect = "default";
            });
        }
   
        