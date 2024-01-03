from datetime import datetime

REFERENCE_HEADER_FORMAT = r"%y%m%d"


def convertDateToReferenceHeader(date):
    return date.strftime(REFERENCE_HEADER_FORMAT)


def lastRefVariable(model):
    today = datetime.today()
    from_today = model.objects.filter(created__date=today)
    if from_today:
        last_record = from_today.last()
        last_ref_num = int(last_record.reference_number[-3:])
        return last_ref_num
    else:
        return 0
