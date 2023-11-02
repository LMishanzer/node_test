# Use an official Node.js runtime as the base image
FROM node:18

# Create a directory to store your application code
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

RUN npm run build

RUN groupadd -g 1500 test \
    && useradd test -g test -u 1500 -s /bin/bash \
    && mkdir -p running_dir/bin running_dir/lib running_dir/lib64 \
    && cp /bin/bash /usr/local/bin/node running_dir/bin \
    && cp /lib/x86_64-linux-gnu/libtinfo.so.6 /lib/x86_64-linux-gnu/libc.so.6 /lib/x86_64-linux-gnu/libdl.so.2 /lib/x86_64-linux-gnu/libdl.so.2 /lib/x86_64-linux-gnu/libstdc++.so.6 /lib/x86_64-linux-gnu/libm.so.6 /lib/x86_64-linux-gnu/libgcc_s.so.1 /lib/x86_64-linux-gnu/libpthread.so.0 /lib/x86_64-linux-gnu/libc.so.6 running_dir/lib \
    && cp /lib64/ld-linux-x86-64.so.2 /lib64/ld-linux-x86-64.so.2 running_dir/lib64 \
    && cp dist/child_index.js dist/test.js running_dir

RUN alias ll='ls -la'

# Expose a port that your application will listen on
EXPOSE 3000

# Define the command to start your Node.js application
CMD ["node", "./dist/index.js"]