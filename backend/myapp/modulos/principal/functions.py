from django.contrib.auth.models import User
from myapp.modulos.principal.models import userSoftSystemProject

def members_only(id_ssp, request):
    project = userSoftSystemProject.objects.get(id=id_ssp)
    user = User.objects.get(id=request.user.id)
    if project.manager == user or user.get_username() in project.contribs_ssp:
        return True
    else:
        return False