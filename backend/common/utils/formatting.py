REFERENCE_HEADER_FORMAT = r"%y%m%d"


def convertDateToReferenceHeader(date):
    return date.strftime(REFERENCE_HEADER_FORMAT)
