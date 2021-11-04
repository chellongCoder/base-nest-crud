echo "Generating module"
nest g module $1 --no-spec
echo "Generating controller"
nest g controller $1 --no-spec
echo "Generating service"
nest g service $1 --no-spec
