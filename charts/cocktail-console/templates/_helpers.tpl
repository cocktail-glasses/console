{{/*
Expand the name of the chart.
*/}}
{{- define "cocktail-console.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "cocktail-console.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "cocktail-console.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "cocktail-console.labels" -}}
helm.sh/chart: {{ include "cocktail-console.chart" . }}
{{ include "cocktail-console.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "cocktail-console.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cocktail-console.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "cocktail-console.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "cocktail-console.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Check whether BaseAddress can be used
*/}}
{{- define "cocktail-console.shouldUseBaseAddress" -}}
{{- if .Values.auth.redirectBaseAddress }}
  {{- true}}
{{- else if .Values.ingress.enabled }}
  {{- if and .Values.ingress.hosts (gt (len .Values.ingress.hosts) 0) }}
    {{- true}}
  {{- else }}
    {{- false}}
  {{- end }}
{{- else }}
  {{- false}}
{{- end }}
{{- end }}

{{/*
Create BaseAddress for OIDC redirect_uri
*/}}
{{- define "cocktail-console.baseAddress" -}}
{{- $redirect := .Values.auth.redirectBaseAddress | default "" | trim }}
{{- if $redirect }}
  {{- $redirect }}
{{- else if .Values.ingress.enabled }}
  {{- if and .Values.ingress.hosts (gt (len .Values.ingress.hosts) 0) (index .Values.ingress.hosts 0).host }}
    {{- printf "https://%s" (index .Values.ingress.hosts 0).host }}
  {{- else }}
    {{- ""}}
  {{- end }}
{{- else }}
  {{- ""}}
{{- end }}
{{- end }}


{{/*
Return ImageBaseUrl
*/}}
{{- define "cocktail-console.image-base-url" -}}
{{- if .Values.imageBaseUrl }}
    {{- .Values.imageBaseUrl -}}
{{- else if .Values.global.defaultImageBaseUrl -}}
    {{- .Values.global.defaultImageBaseUrl -}}
{{- else -}}
    {{ default "regi.acloud.run" .Values.imageBaseUrl }}
{{- end -}}
{{- end -}}