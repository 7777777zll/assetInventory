node('parentnode') {
    checkout scm
    docker.image('schlez/docker-node-gyp:latest').inside('-u root:root') {
        sh 'npm install -g cnpm --registry=https://registry.npm.taobao.org'
        sh 'cnpm install'
        sh 'cnpm install sw-precache-webpack-plugin'
        sh 'cnpm rebuild node-sass --force'
        sh 'cnpm install -g node-gyp'
       // sh 'npm install --global --production windows-build-tools'
        sh 'npm run build'
        
    }

    def customImage = docker.build("check-app:${env.BUILD_ID}")
    docker.withRegistry('http://192.168.10.231:5000/v2/') {
        customImage.push()
        customImage.push('latest')
    }
}