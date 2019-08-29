FROM library/node:10-alpine
RUN npm i -g  typescript ts-node
WORKDIR /work
COPY . .
RUN npm i && tsc

FROM library/node:10-alpine  
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=0 /work/dist ./dist
COPY --from=0 /work/node_modules ./node_modules
COPY --from=0 /work/package.json .
CMD ["npm", "run", "start"]  
EXPOSE 80