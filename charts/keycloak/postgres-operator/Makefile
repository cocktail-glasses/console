export NAME=postgres-operator
export NAMESPACE=acorn-$(NAME)

include ../../../scripts/package.mk

update:
	rm -rf charts
	helm repo add cnpg https://cloudnative-pg.github.io/charts
	helm repo update cnpg
	helm pull cnpg/cloudnative-pg --untar --untardir charts
	rm -rf charts/cloudnative-pg/charts
