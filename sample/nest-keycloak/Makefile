NAME=klg-nest-starter
REGISTRY=registry.cn-shenzhen.aliyuncs.com
TAG = beta

build:
	echo building ${NAME}:${TAG}
	docker build -t ${REGISTRY}/${NAME}:${TAG} .
	docker push "${REGISTRY}/${NAME}:${TAG}"
