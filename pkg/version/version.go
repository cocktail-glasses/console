package version

// version.Version should be provided at build time with
// -ldflags "-X github.com/cocktailcloud/cocktail-glasses/version.Version $GIT_TAG"
var Version string

type KubeVersionGetter interface {
	GetKubeVersion() string
}
