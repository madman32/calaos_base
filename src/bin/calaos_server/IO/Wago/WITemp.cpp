/******************************************************************************
 **  Copyright (c) 2006-2014, Calaos. All Rights Reserved.
 **
 **  This file is part of Calaos.
 **
 **  Calaos is free software; you can redistribute it and/or modify
 **  it under the terms of the GNU General Public License as published by
 **  the Free Software Foundation; either version 3 of the License, or
 **  (at your option) any later version.
 **
 **  Calaos is distributed in the hope that it will be useful,
 **  but WITHOUT ANY WARRANTY; without even the implied warranty of
 **  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 **  GNU General Public License for more details.
 **
 **  You should have received a copy of the GNU General Public License
 **  along with Foobar; if not, write to the Free Software
 **  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 **
 ******************************************************************************/
#include <WITemp.h>
#include <WagoMap.h>
#include <IOFactory.h>

using namespace Calaos;

REGISTER_INPUT(WITemp)
REGISTER_INPUT_USERTYPE(WagoInputTemp, WITemp)

WITemp::WITemp(Params &p):
    InputTemp(p),
    port(502),
    requestInProgress(false),
    start(true)
{
    // Define IO documentation
    ioDoc->friendlyNameSet("WITemp");
    ioDoc->aliasAdd("WagoInputTemp");
    ioDoc->descriptionSet("Temperature measurement with Wago temperature module (like 750-460)");
    ioDoc->linkAdd("Calaos Wiki", "http://calaos.fr/wiki/fr/750-460");
    ioDoc->paramAdd("host", "Wago PLC IP address on the network", IODoc::TYPE_STRING, true);
    ioDoc->paramAdd("port", "Wago ethernet port, default to 502",
                    IODoc::TYPE_INT, false);

    ioDoc->paramAdd("var", "PLC address of the input sensor", IODoc::TYPE_INT, true);

    host = get_param("host");

    Utils::from_string(get_param("var"), address);
    if (get_params().Exists("port"))
        Utils::from_string(get_param("port"), port);

    WagoMap::Instance(host, port);

    requestInProgress = true;
    WagoMap::Instance(host, port).read_words((UWord)address, 1, sigc::mem_fun(*this, &WITemp::WagoReadCallback));

    Calaos::StartReadRules::Instance().addIO();

    cDebugDom("input") << get_param("id") << ": Ok";
}

WITemp::~WITemp()
{
    cDebugDom("input") << get_param("id") << ": Ok";
}

void WITemp::WagoReadCallback(bool status, UWord addr, int count, vector<UWord> &values)
{
    requestInProgress = false;

    if (!status)
    {
        cErrorDom("input") << get_param("id") << ": Failed to read value";
        if (start)
        {
            Calaos::StartReadRules::Instance().ioRead();
            start = false;
        }

        return;
    }

    double val = value;

    if (!values.empty())
        val = (short int)values[0] / 10.0;

    if (val != value)
    {
        value = val;
        emitChange();
    }

    if (start)
    {
        Calaos::StartReadRules::Instance().ioRead();
        start = false;
    }
}

void WITemp::readValue()
{
    if (!requestInProgress)
    {
        requestInProgress = true;
        WagoMap::Instance(host, port).read_words((UWord)address, 1, sigc::mem_fun(*this, &WITemp::WagoReadCallback));
    }
}
